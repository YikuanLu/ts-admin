import { message } from 'antd'
import { getBaseUrl } from '@/api/common'

let ossUrl = '12341234'
getBaseUrl()
  .then((res) => {
    const { data } = res
    ossUrl = data
  })
  .catch(() => {
    message.error('获取oss地址失败,请联系运维')
  })

export const sourceSize = {
  imageSize: 1048576 * 50,
  videoSize: 1048576 * 100
}

export const getOssUrl = (): string => ossUrl
export const urlConfig = {
  crawlerAddress: 'http://192.168.0.8:15155'
}
