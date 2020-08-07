import Axios, { AxiosResponse, AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import qs from 'qs'
import { store } from '@/store'
import { StrMap, StoreValue } from '@/global'

interface HttpConfig {
  timeout: number;
}

export interface DataProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propsName: string]: any
}

// 跳转回登录
const redirectToLogin = (): void => {
  message.error('您未登录')
  const { origin, pathname } = window.location
  const redirectUrl = `${origin}${pathname}#/login`
  window.location.replace(redirectUrl)
}

const axiosConfig: HttpConfig = {
  timeout: 600000,
}

const instance = Axios.create(axiosConfig)

function resolveFn(response: AxiosResponse<DataProps>): AxiosPromise<DataProps> {
  return Promise.resolve(response)
}

const rejectFn = (err: AxiosError): AxiosPromise => {
  // 判断请求是否已取消
  if (Axios.isCancel(err)) {
    // 返回一个空Promise，将Error Handler终止传递，这一步很重要
    return new Promise(() => { })
  }
  if (err.response) {
    // debugger
    if (err.response.status === 401) {
      redirectToLogin()
    } else if (err.response.status === 510) {
      message.error('重新获取链接已失效')
    } else {
      message.error(err.response.data.message)
    }
  }
  return Promise.reject(err.response)
}

const encodeParams = (data: StrMap): string => Object.entries(data)
  .filter((([_, val]) => val !== undefined))
  .map(([key, val]) => `${key}=${val}`)
  .join('&')
// 请求前拦截
instance.interceptors.request.use(
  (config) => {
    const insideConfig = config
    // 序列化get请求参数
    if (insideConfig.method === 'get') {
      const encodeStr = encodeURI(encodeParams(insideConfig.params))
      insideConfig.url = encodeStr ? `${insideConfig.url}?${encodeStr}` : insideConfig.url
      insideConfig.params = {}
    }
    const { token } = store.getState().userReducer
    if (!token) {
      const { url } = config
      if (url !== '/user/admin/login' && url !== '/common/oss/getBaseUrl') {
        redirectToLogin()
      }
    }
    insideConfig.headers.Authorization = token
    return insideConfig
  },
  (err) => Promise.reject(err)
)

// 返回后拦截
instance.interceptors.response.use(resolveFn, rejectFn)

export function httpPost<P, T = DataProps>(
  url: string,
  data?: P,
  config?: AxiosRequestConfig
): AxiosPromise<T> {
  return instance.post<T>(url, data, config)
}

export function httpGet<P, T = DataProps>(
  url: string,
  data?: P
): AxiosPromise<T> {
  const params = data ? { ...data } : {}
  return instance.get<T>(url, { params })
}

export function httpPut<P, T = DataProps>(
  url: string,
  data?: P | string,
  toSerializer?: boolean // 是否序列号参数
): AxiosPromise<T> {
  let sentParams = data
  if (toSerializer) {
    sentParams = qs.stringify(data, { indices: false })
  }
  return instance.put<T>(url, sentParams)
}

export function httpDelete<P, T = DataProps>(
  url: string,
  data?: P,
  toSerializer?: boolean // 是否序列号参数
): AxiosPromise<T> {
  const paramsSerializer = toSerializer
    ? (params: StoreValue): string => qs.stringify(params, { indices: false })
    : undefined
  return instance.delete<T>(url, {
    params: data,
    paramsSerializer
  })
}
