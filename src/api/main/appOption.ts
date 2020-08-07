import { AxiosPromise } from 'axios'
import {
  httpGet,
  DataProps,
  httpPost
} from '@/utils/axios'
import { ListParams } from '@/components/common/table/types'

// app配置-轮播图管理列表
export function getBannerList<T>(data: ListParams): AxiosPromise<DataProps> {
  return httpGet<ListParams, T>('/activity/admin/banner/pageBySearchSO', data)
}

// app配置-单个轮播图详情
export function getBannerItem<T = {}, P = DataProps>(data: T): AxiosPromise<P> {
  return httpGet<T, P>('/activity/admin/banner/findById', data)
}

// app配置-轮播图修改状态
export function handleBannerStatus<T>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/activity/admin/banner/updateByEnable', data)
}

// app配置-删除轮播图
export function deleteBanner<T>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/activity/admin/banner/updateByDeleted', data)
}

// app配置-新增轮播图
export function saveBannerItem<T = {}, P = DataProps>(data: T): AxiosPromise<P> {
  return httpPost<T, P>('/activity/admin/banner/save', data)
}

// app配置-推荐比赛列表
export function getRecommendGame<T>(data: ListParams): AxiosPromise<T> {
  return httpGet<ListParams, T>('/sport/admin/recommend/match/pageBySearchSO', data)
}

// app配置-推荐比赛列表-修改状态
export function patchRecommendGame<T = {}>(data: T): AxiosPromise<DataProps> {
  return httpPost<T>('/sport/admin/recommend/match/updateByEnable', data)
}

// app配置-推荐比赛列表-删除
export function deleteRecommendGame<T = {}>(
  data: T
): AxiosPromise<DataProps> {
  return httpPost<T>('/sport/admin/recommend/match/updateByDeleted', data)
}

// app配置-推荐比赛列表-添加/修改
export function updateRecommendGame<T = {}>(
  data: T
): AxiosPromise<DataProps> {
  return httpPost<T>('/sport/admin/recommend/match/save', data)
}
