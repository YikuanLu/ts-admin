import {
  StatusEnum,
  ReportResultEnum
} from '@/pages/main/option/report/reportType'

type Status = keyof typeof StatusEnum
type ReportResult = keyof typeof ReportResultEnum

export interface ReportDetail {
  id: number | string,
  uuid: number | string,
  businessId: number | string, // 业务id
  title: string, // 标题
  clickNum: number, // 被举报次数
  userNum: number// 举报用户数
  createTime: string, // 最近建单时间
  status: Status, // 状态
  assignee: string, // 受理人
  solveTime: string, // 受理时间
  acceptanceResult: ReportResult// 受理结果
}
