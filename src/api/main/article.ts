import { AxiosPromise } from 'axios'
import { DataProps, httpGet } from '@/utils/axios'

// 文章编辑-标签列表
export function getLabelList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/information/admin/label/labelAndGroup', data)
}

// 文章编辑-话题列表
export function getTopicList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/information/admin/topic/pageByTopicName', data)
}
