import {
  MatchStatus,
  MatchStage
} from '@/pages/sport/football/typeData'

// ⚽️赛事数据类型
export interface FootballMatchItem {
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

// ⚽️战队数据类型
export interface FootballTeamItem {
  id: string,
  name: string,
  englishName: string,
  shortName: string,
  englishShortName: string,
  logo: string,
  matchId: string,
  matchName: string,
  matchLogo: string,
  matchEnglishName: string,
  description: string
}

export interface FootballPlayerItem {
  age: string;
  ballAge: string;
  birthday: string;
  birthplace: string;
  country: string;
  description: string;
  draftRank: string;
  englishName: string;
  englishShortName: string;
  height: string;
  id: string;
  jersey: string;
  joinTime: string;
  logo: string;
  name: string;
  position: string;
  retire: boolean;
  retirementTime: string;
  school: string;
  shortName: string;
  teamEnglishName: string;
  teamId: string;
  teamLogo: string;
  teamName: string;
  weight: string;
  yearSalary: string
}

type MatchStageKeysType = keyof typeof MatchStage
type MatchStatusKeysType = keyof typeof MatchStatus

export interface FootballScheduleItem {
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
