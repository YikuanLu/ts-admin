import {
  MatchStatus,
  MatchStage
} from '@/pages/sport/basketball/typeData'

export interface ModalProps {
  visible: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemData?: any,
  cancelFn: () => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updataList: (val?: any) => void
}

// 🏀赛事数据类型
export interface BasketballMatchItem {
  id: string,
  createId: number,
  createTime: string,
  updateId: number,
  updateTime: string,
  logo: string,
  name: string,
  englishName: string,
  englishShortName: string,
  shortName: string,
  region: string,
  country: string,
  forbidden: boolean,
  articleNum: number,
  subjectNum: number,
  informationHot: number,
  informationPopularity: number,
  matchHot: number,
  matchPopularity: number,
  description: string,
  orderNum: number
}

// 🏀赛队数据类型
export interface BasketballTeamItem {
  beDivision: string,
  bePartition: string,
  description: string,
  englishName: string,
  englishShortName: string,
  follow: boolean,
  homeCourt: string,
  homeCourtCapacity: string,
  id: number | string,
  logo: string,
  matchEnglishName: string,
  matchId: number | string,
  matchLogo: string,
  matchName: string,
  matchShortName: string,
  name: string,
  originalName: string,
  shortName: string
}

// 🏀赛季数据类型
export interface SeasonItem {
  endTime: string;
  id: string;
  matchEnglishName: string;
  matchId: string;
  matchLogo: string;
  matchName: string;
  name: string
  startTime: string
}

type MatchStageKeysType = keyof typeof MatchStage
type MatchStatusKeysType = keyof typeof MatchStatus

export interface BastetballScheduleItem {
  chatRoomId: string,
  description: string,
  guestTeamId: number,
  guestTeamLogo: string,
  guestTeamName: string,
  guestTeamScore: number,
  homeTeamId: number,
  homeTeamLogo: string,
  homeTeamName: string,
  homeTeamScore: number,
  id: number,
  liveType: PROGRESS | ANIMATION,
  matchEnglishName: string,
  matchEnglishShortName: string,
  matchId: number,
  matchLogo: string,
  matchName: string,
  matchShortName: string,
  name: string,
  progressStatus: NOT_BEGIN | PROGRESS | FINISH | ABNORMAL,
  realStartTime: string,
  reason: string,
  seasonId: number,
  seasonName: string,
  seasonShowName: string,
  stage: LEAGUE | CUP | FRIENDLY,
  startTime: string,
  status: string,
  statusName: string,
  statusRealName: string,
  venue: string
}


export interface BasketballPlayerItem {
  age: number,
  armSpread: string,
  ballAge: string,
  birthday: string,
  birthplace: string,
  contractContent: string,
  country: string,
  description: string,
  draftRank: string,
  englishName: string,
  englishShortName: string,
  height: string,
  id: number | string,
  jersey: string,
  joinTime: string,
  logo: string,
  name: string,
  originalName: string,
  position: string,
  retire: true,
  retirementTime: string,
  school: string,
  shortName: string,
  standingReach: string,
  teamId: number | string,
  weight: string,
  yearSalary: string,
  teamEnglishName: string,
  teamId: number | string,
  teamLogo: string,
  teamName: string,
  teamShortName: string,
}
