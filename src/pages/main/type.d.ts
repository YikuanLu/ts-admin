import { SportType } from '@/config/dataTypes'
import { MaterialTypes } from '@/pages/main/statusType'

export interface RecordMap {
  createTime: string; // 创建时间
  quoteArticleId: number; // 文章ID
  text: string; // 文本
}

export type Status = keyof typeof MaterialTypes

export type Types = 'PICTURE' | 'VIDEO' | 'INFORMATION'

export interface MaterialItem {
  auditId: number; // 审核人ID
  itemType: SportType; // 体育项目
  auditName: string; // 审核人
  auditTime: string; // 审核时间
  channels: string[]; // 外部频道
  collectNum: number; // 外部收藏数
  commentNum: number; // 外部回复数
  content: string; // 内容
  cover: string;// 封面
  createTime: string; // 创建时间
  downloadPlatform: string; // 下载平台
  downloadTime: string; // 下载时间
  giveNum: number; // 外部点赞数
  id: number; // UID
  keywords: string[], // 关键字
  link: string; // 原文链接
  quote: boolean // 是否引用
  records: RecordMap[]; // 操作记录
  releaseTime: string; // 外部发布时间
  shareNum: number; // 外部转发数
  status: Status; // 审核状态
  subjectHot: number; // 热度
  subjectName: string; // 外部话题
  title: string; // 文章标题
  type: Types; // 类型
  viewNum: number; // 外部浏览数
}
