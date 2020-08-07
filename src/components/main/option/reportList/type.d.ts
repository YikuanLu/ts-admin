import { reportType } from './reportType'

export interface ComplainDetailItem {
  additionalDescription: string
  createTime: string
  imageNames: string[]
  number: string
  type: reportType
  userId: string
  userName: string
}

export interface ListRes {
  page: number,
  size: number,
  count: number,
  content: ComplainDetailItem[],
}

export interface ListParams {
  businessId: string,
  type: string,
  page: number,
  size: number
}
