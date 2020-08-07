import { AxiosPromise } from 'axios'
import { ListParams } from '@/components/common/table/types'
import {
  DataProps,
  httpGet,
  // httpPut,
  httpPost
} from '@/utils/axios'

// 🏀赛事-获取赛事列表
export function getBasketballMatchList(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams>('/sport/admin/basketball/match', data)
}

// 🏀赛事-获取赛事详情
export function getBasketballMatchItem(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet(`/sport/admin/basketball/match/${data.id}`)
}

// 🏀赛事-更新禁用状态
export function patchBasketballStatus(data: { id: string }): AxiosPromise<DataProps> {
  return httpPost(`/sport/admin/basketball/match/${data.id}`)
}

// 🏀赛事-更新禁用状态
export function updateBasketballSort<T>(data: T): AxiosPromise<DataProps> {
  return httpPost('/sport/admin/basketball/match/updateOrderNum', data)
}

// 🏀赛事-赛季列表
export function getBasketballSeasonList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/sport/admin/basketball/season', data)
}

// 🏀赛事-球队列表
export function getBasketballTeamList(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams>('/sport/admin/basketball/team', data)
}

// 🏀赛事-球队详情
export function getBasketballTeamItem(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet<ListParams>(`/sport/admin/basketball/team/${data.id}`)
}

// 🏀赛事-球队-新增/编辑
export function updateBasketballTeamItem<T>(data: T): AxiosPromise<DataProps> {
  return httpPost('/sport/admin/basketball/team/saveOrUpdate', data)
}

// 🏀赛事-赛程赛果  --改版过
export function getBasketballScheduleList<T>(data: ListParams): AxiosPromise<T> {
  return httpGet<ListParams, T>('/sport/admin/basketball/schedule', data)
}

// 🏀赛程赛果-新增/修改 -- 改版过
export function updateBasketballcheduleItem<T>(data: T): AxiosPromise<DataProps> {
  return httpPost('/sport/admin/basketball/schedule/saveOrUpdate', data)
}

// 🏀赛事-赛程赛果详情
export function getBasketballScheduleItem(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet(`/sport/admin/basketball/schedule/${data.id}`)
}

// 🏀赛事-球员列表
export function getBasketballPlayerList(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams>('/sport/admin/basketball/player', data)
}

// 🏀赛事-球员详情
export function getBasketballPlayerItem(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet<ListParams>(`/sport/admin/basketball/player/${data.id}`)
}

// 🏀球员-新增/修改 -- 改版过
export function updateBasketballPlayerItem<T>(data: T): AxiosPromise<DataProps> {
  return httpPost('/sport/admin/basketball/player/saveOrUpdate', data)
}

// 🏀赛事-数据记录
export function getBasketballRecordList<T>(data: ListParams): AxiosPromise<T> {
  return httpGet<ListParams, T>('/sport/admin/basketball/record', data)
}
