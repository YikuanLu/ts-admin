export enum DataReordStageEnum {
  'LEAGUE' = '联赛',
  'PRESEASON' = '季前赛',
  'REGULAR' = '常规赛',
  'PLAYOFF' = '季后赛',
  'CHAMPION' = '总冠军赛',
  'All_START' = '全明星赛',
}
export const dataReordStageSelect = [
  {
    name: '联赛',
    key: 'LEAGUE'
  },
  {
    name: '季前赛',
    key: 'PRESEASON'
  },
  {
    name: '常规赛',
    key: 'REGULAR'
  },
  {
    name: '季后赛',
    key: 'PLAYOFF'
  },
  {
    name: '总冠军赛',
    key: 'CHAMPION'
  },
  {
    name: '全明星赛',
    key: 'All_START'
  },
]

export enum DataReordTransactionTypeEnum {
  'ENTERED' = '上场',
  'DEPARTURE' = '离场',
  'THREE_POINTS' = '三分球',
  'SECOND_POINTS' = '二分球',
  'PENALTY_SHOT' = '罚球',
  'FOUL' = '犯规',
  'BACKBOARD' = '篮板',
  'DEFENSE' = '防守',
  'ATTACK' = '进攻',
  'ASSISTS' = '助攻',
  'MISSES' = '失误',
  'STEALS' = '抢断',
  'BLOCKS' = '盖帽',
}
export const dataReordTransactionTypeSelect = [
  {
    name: '上场',
    key: 'ENTERED'
  },
  {
    name: '离场',
    key: 'DEPARTURE'
  },
  {
    name: '三分球',
    key: 'THREE_POINTS'
  },
  {
    name: '二分球',
    key: 'SECOND_POINTS'
  },
  {
    name: '罚球',
    key: 'PENALTY_SHOT'
  },
  {
    name: '犯规',
    key: 'FOUL'
  },
  {
    name: '篮板',
    key: 'BACKBOARD'
  },
  {
    name: '防守',
    key: 'DEFENSE'
  },
  {
    name: '进攻',
    key: 'ATTACK'
  },
  {
    name: '助攻',
    key: 'ASSISTS'
  },
  {
    name: '失误',
    key: 'MISSES'
  },
  {
    name: '抢断',
    key: 'STEALS'
  },
  {
    name: '盖帽',
    key: 'BLOCKS'
  },
]
