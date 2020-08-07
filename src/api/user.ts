import { AxiosPromise } from 'axios'
import {
  DataProps,
  httpGet,
  httpPost,
  httpPut,
  httpDelete
} from '@/utils/axios'
import { ListParams } from '@/components/common/table/types'

export function login<P>(data: P): AxiosPromise<DataProps> {
  return httpPost<P>('/user/admin/login', data)
}

// 后台查找C端用户信息<精简版>
export function getClientUser<P={}>(data: P): AxiosPromise<DataProps> {
  return httpGet<P>('/user/admin/user', data)
}

// 后台获取C端用户信息列表<完全版>
export function toGetClientUser(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams>('/behavior/admin/user', data)
}

// 后台获取C端用户详情
export function getUserDetail<P={}>(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet<P>(`/user/admin/user/${data.id}`)
}

// 新增用户
export function addUser<P>(data: P): AxiosPromise<DataProps> {
  return httpPost<P>('/user/admin/user', data)
}

// 修改用户禁用状态
export function changeUserForbidden<P>(data: P): AxiosPromise<DataProps> {
  return httpPut<P>('/user/admin/user/forbidden', data)
}

// 修改用户信息
export function changeUserInfo<P>(data: P): AxiosPromise<DataProps> {
  return httpPut<P>('/user/admin/user', data)
}

// 修改用户信息
export function deleteUser<P>(data: { id: string }): AxiosPromise<DataProps> {
  return httpDelete<P>(`/user/admin/user/${data.id}`)
}
