import { AxiosPromise } from 'axios'
import {
  DataProps,
  httpGet,
} from '@/utils/axios'
import { ListParams } from '@/components/common/table/types'

// 屏蔽管理-文章屏蔽列表
export function getBlockArticleList<P = ListParams, R = DataProps>(data: P): AxiosPromise<R> {
  return httpGet<P, R>('/behavior/admin/block/articleList', data)
}
// 屏蔽管理-话题屏蔽列表
export function getBlockTopicList<P = ListParams, R = DataProps>(data: P): AxiosPromise<R> {
  return httpGet<P, R>('/behavior/admin/block/subjectList', data)
}
// 屏蔽管理-用户屏蔽列表
export function getBlockUserList<P = ListParams, R = DataProps>(data: P): AxiosPromise<R> {
  return httpGet<P, R>('/behavior/admin/block/userList', data)
}
