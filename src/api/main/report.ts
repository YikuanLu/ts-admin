import { AxiosPromise } from 'axios'
import { httpGet, DataProps, httpPost } from '@/utils/axios'
import { ListParams } from '@/components/common/table/types'

// 举报列表-获取举报列表
export function getReportList<T>(data: ListParams): AxiosPromise<T> {
  return httpGet<ListParams, T>('/behavior/admin/complaint/findByTypePage', data)
}

// 举报列表-获取举报文章详情
export function getArticleReportInfo<P = {}, R = DataProps>(data: P): AxiosPromise<R> {
  return httpGet<P, R>('/behavior/admin/complaint/findByInformation', data)
}

// 举报列表-获取举报用户详情
export function getUserReportInfo<P = {}, R = DataProps>(data: P): AxiosPromise<R> {
  return httpGet<P, R>('/behavior/admin/complaint/findByUser', data)
}

// 举报列表-获取举报回复详情
export function getCommentReportInfo<P = {}, R = DataProps>(data: P): AxiosPromise<R> {
  return httpGet<P, R>('/behavior/admin/complaint/findByComment', data)
}

// 举报列表-获取举报回复详情
export function getComplainDetailList<P = ListParams, R = DataProps>(data: P): AxiosPromise<R> {
  return httpGet<P, R>('/behavior/admin/complaint/findComplaintDetail', data)
}

// 举报列表-获取举报处理详情
export function getReportHandleInfo<P = ListParams, R = DataProps>(data: P): AxiosPromise<R> {
  return httpGet<P, R>('/behavior/admin/complaint/findByHandleInfo', data)
}

// 举报列表-处理举报
export function updateReportStatus<P>(data: P): AxiosPromise<DataProps> {
  return httpPost<P>('/behavior/admin/complaint/updateStatus', data)
}
