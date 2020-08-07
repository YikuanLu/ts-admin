import { DataReordStageEnum, DataReordTransactionTypeEnum } from '@/pages/sport/basketball/dataRecord/typeData'

export type DataReordStage = keyof typeof DataReordStageEnum

export type DataReordTransactionType = keyof typeof DataReordTransactionTypeEnum

export interface DataRecordModels {
  createTime: string,
  id: string | number,
  matchEnglishName: string, // 赛事英文名称
  matchId: string | number,
  matchName: string, // 赛事名称
  num: string | number, // 数值
  playerId: string | number,
  playerLogo: string, // 球员logo
  playerName: string, // 球员名称
  position: string, // 位置
  scheduleId: string | number, // 赛程ID
  season: string, // 赛季
  seasonEndTime: string, // 赛季结束时间
  seasonId: string | number, // 赛季ID
  seasonStartTime: string, // 赛季开始时间
  stage: DataReordStage, // 比赛阶段
  teamId: string | number, // 战队ID
  teamName: string, // 战队名称
  transactionType: DataReordTransactionType // 事务/技术类型
}
