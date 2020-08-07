import { AxiosPromise } from 'axios'
import {
  // DataProps,
  httpGet, httpPost, DataProps,
} from '@/utils/axios'
import { ListParams } from '@/components/common/table/types'

// 话题管理-版块列表
export function getSectionGroupList(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams>('/information/admin/topic/group/pageAOByTopicGroupSearchRO', data)
}

// 话题管理-获取板块详情
export function getSectionGroupDetail<T>(data: ListParams): AxiosPromise<T> {
  return httpGet<ListParams, T>('/information/admin/topic/group/findById', data)
}

// 话题管理-保存板块(新增/编辑)
export function saveSectionGroup<T>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/information/admin/topic/group/save', data)
}

// 话题管理-版块启禁用
export function updateSectionGroupEnabled<T>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/information/admin/topic/group/updateByEnabled', data)
}

// 话题管理-版块删除
export function updateSectionGroupDelete<T>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/information/admin/topic/group/updateByDeleted', data)
}

// 话题管理-话题列表
export function getTopicList<T>(data: ListParams): AxiosPromise<T> {
  return httpGet<ListParams, T>('/information/admin/topic/pageAOByTopicSearchRO', data)
}

// 话题管理-单条话题详情
export function getTopicDetail<T>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/information/admin/topic/findById', data)
}

// 话题管理-话题启禁用
export function updateTopicEnabled<T>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/information/admin/topic/updateByEnabled', data)
}

// 话题管理-话题删除
export function updateTopicDelete<T>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/information/admin/topic/updateByDeleted', data)
}

// 话题管理-保存话题(新增/编辑)
export function saveTopic<T>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/information/admin/topic/save', data)
}
