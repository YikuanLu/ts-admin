import { AxiosPromise } from 'axios'
import { ListParams } from '@/components/common/table/types'
import {
  DataProps,
  httpGet,
  httpPost,
  httpDelete
} from '@/utils/axios'

// ⚽️-获取赛事列表
export function getFootballMatchList(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams>('/sport/admin/football/match', data)
}

// ⚽️-获取赛事详情
export function getFootballMatchItem(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet(`/sport/admin/football/match/${data.id}`)
}

// ⚽️-更新赛事禁用状态
export function patchFootballStatus(data: { id: string }): AxiosPromise<DataProps> {
  return httpPost(`/sport/admin/football/match/${data.id}`)
}

// ⚽️-更新赛事排序
export function updateFootballSort<T>(data: T): AxiosPromise<DataProps> {
  return httpPost('/sport/admin/football/match/updateOrderNum', data)
}

// ⚽️-赛季列表
export function getFootballSeasonList<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpGet<T>('/sport/admin/football/season', data)
}

// ⚽️-球队列表
export function getFootballTeamList(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams>('/sport/admin/football/team', data)
}

// ⚽️-球队详情
export function getFootballTeamItem(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet<ListParams>(`/sport/admin/football/team/${data.id}`)
}

// ⚽️-保存球队
export function saveFootballTeam<T>(data:T): AxiosPromise<DataProps> {
  return httpPost('/sport/admin/football/team/saveOrUpdate', data)
}

// ⚽️-删除球队
export function deleteFootBallTeam<T>(data: T): AxiosPromise<DataProps> {
  return httpDelete<T>('/aggregation/deleteByTeam', data, true)
}

// ⚽️-球员列表
export function getFootballPlayerList(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams>('/sport/admin/football/player', data)
}

// ⚽️-球员详情
export function getFootballPlayerItem(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet<ListParams>(`/sport/admin/football/player/${data.id}`)
}

// ⚽️-保存球员
export function saveFootballPlayer<T>(data: T): AxiosPromise<DataProps> {
  return httpPost('/sport/admin/football/player/saveOrUpdate', data)
}

// ⚽️-删除球员
export function deleteFootballPlayer<T>(data:T): AxiosPromise<DataProps> {
  return httpDelete<T>('/aggregation/deleteByPlayer', data, true)
}

// ⚽️-赛程赛果 -- 改版过
export function getFootballScheduleList<T>(data: ListParams): AxiosPromise<T> {
  return httpGet<ListParams, T>('/sport/admin/football/schedule', data)
}


// ⚽️-赛程赛果-新增/修改 -- 改版过
export function updateFootballcheduleItem<T>(data: T): AxiosPromise<DataProps> {
  return httpPost('/sport/admin/football/schedule/saveOrUpdate', data)
}

// ⚽️-赛程赛果详情
export function getFootballScheduleItem(data: { id: string }): AxiosPromise<DataProps> {
  return httpGet(`/sport/admin/football/schedule/${data.id}`)
}
