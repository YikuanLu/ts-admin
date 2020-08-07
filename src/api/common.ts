import { AxiosPromise, AxiosRequestConfig } from 'axios'
import {
  DataProps,
  httpGet,
  httpPost
} from '@/utils/axios'
import { urlConfig } from '@/config/publicConfig'


export function getUploadSign<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/common/oss/webUploadSign', data)
}

export function uploadFn<T = {}>(
  url: string,
  data: T,
  config?: AxiosRequestConfig
): AxiosPromise<DataProps> {
  return httpPost<T>(url, data, config)
}

// 重新获取多媒体资源地址
export function reGetMedial<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>(`${urlConfig.crawlerAddress}/refreshVideo`, data)
}
// 获取oss地址
export function getBaseUrl(): AxiosPromise<string> {
  return httpGet('/common/oss/getBaseUrl')
}

// 省市区三级联动接口
export function getAreaList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/common/area/webTreeList', data)
}
