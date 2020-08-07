import { AxiosPromise } from 'axios'
import {
  httpGet,
  httpPost,
  DataProps
} from '@/utils/axios'
import { ListParams } from '@/components/common/table/types'

// 词库管理-获取标签分类列表
export function getArticleLabel<T>(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams, T>('/information/admin/label/group/pageByLabelGroupSearch', data)
}

// 词库管理-新增/修改标签分类
export function updatArticleLabel<P>(data: P): AxiosPromise {
  return httpPost<P>('/information/admin/label/group/save', data)
}

// 词库管理-编辑标签的启禁用状态
export function updatLabelEnabled<P>(data: P): AxiosPromise {
  return httpPost<P>('/information/admin/label/updateByEnabled', data)
}

// 词库管理-获取标签列表
export function getLabelList<T>(data: ListParams): AxiosPromise<T> {
  return httpGet<ListParams, T>('/information/admin/label/pageByLabelDTO', data)
}

// 词库管理-新增/修改标签列表
export function saveLabel<P>(data: P): AxiosPromise {
  return httpPost<P>('/information/admin/label/save', data)
}

// 词库管理-新增/修改标签列表
export function getLabelItem<T>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/information/admin/label/findById', data)
}
