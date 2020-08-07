import { AxiosPromise } from 'axios'
import { httpGet, DataProps, httpPost, httpDelete } from '@/utils/axios'
import { ListParams } from '@/components/common/table/types'

// 比赛管理-体育项目列表
export function getSportsList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/sport/admin/item', data)
}

// 比赛管理-新建体育项目
export function saveSports<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/sport/admin/item', data)
}

// 比赛管理-修改体育项目状态
export function changeSportStatus<T = {}>(data: { id: string }): AxiosPromise<DataProps> {
  return httpPost<T>(`/sport/admin/item/${data.id}`)
}

// 聚合接口-赛程列表
export function sportSchedule<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/sport/admin/schedule', data)
}

// 聚合接口-赛事列表
export function sportScheduleList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/sport/admin/item/childList', data)
}

// 聚合接口-球队列表
export function sportTeamList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/sport/admin/team', data)
}
// 聚合接口-球员列表
export function sportPlayerList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/sport/admin/player', data)
}


// ⚽️/ 🏀-赛程赛果-删除 -- 改版过
export function deleteScheduleItem<T>(data: ListParams): AxiosPromise<T> {
  return httpDelete<ListParams, T>('/aggregation/deleteBySchedule', data)
}

// ⚽️/ 🏀-赛程球队-删除 -- 改版过
export function deleteTeamItem<T>(data: ListParams): AxiosPromise<T> {
  return httpDelete<ListParams, T>('/aggregation/deleteByTeam', data)
}

// ⚽️/ 🏀-赛程球员-删除 -- 改版过
export function deletePlayerItem<T>(data: ListParams): AxiosPromise<T> {
  return httpDelete<ListParams, T>('/aggregation/deleteByPlayer', data)
}
