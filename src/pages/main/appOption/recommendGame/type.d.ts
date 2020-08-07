import { SportType } from '@/config/data'
import { StageEnum } from './typeData'

export type StageType = keyof typeof StageEnum

export interface Schedule {
  chatRoomId: number,
  guestTeamId: number,
  guestTeamLogo: string,
  guestTeamName: string,
  guestTeamScore: number,
  homeTeamId: number,
  homeTeamLogo: string,
  homeTeamName: string,
  homeTeamScore: number,
  id: number,
  liveType: PROGRESS,
  matchEnglishName: string,
  matchEnglishShortName: string,
  matchId: number,
  matchLogo: string,
  matchName: string,
  matchShortName: string,
  name: string,
  progressStatus: string,
  realStartTime: string,
  seasonId: number,
  seasonName: string,
  seasonShowName: string,
  stage: StageType,
  startTime: string,
  status: string,
  statusName: string,
  type: SportType,
  venue: string
}

export interface RecommendGameModel {
  enable: boolean,
  endTime: string,
  id: string | number,
  matchId: number,
  sort: number,
  startTime: string,
  schedule: Schedule
}
