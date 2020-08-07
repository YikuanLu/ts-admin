// 比赛状态
export enum MatchStatus {
  'ABNORMAL' = '异常',
  'NOT_BEGIN' = '未开赛',
  'FIRST_HALF' = '上半场',
  'MIDFIELD' = '中场',
  'SECOND_HALF' = '下半场',
  'OVERTIME' = '加时',
  'PENALTY_MATCH' = '点球决战',
  'COMPLETE' = '完场',
  'SUSPEND' = '中断',
  'CANCEL' = '取消',
  'DELAY' = '延期',
  'SCRAPPED' = '腰斩',
  'PENDING' = '待定'
}

export const matchStatusSelectList = [
  {
    name: '异常',
    key: 'ABNORMAL'
  },
  {
    name: '未开赛',
    key: 'NOT_BEGIN'
  },
  {
    name: '上半场',
    key: 'FIRST_HALF'
  },
  {
    name: '中场',
    key: 'MIDFIELD'
  },
  {
    name: '下半场',
    key: 'SECOND_HALF'
  },
  {
    name: '加时',
    key: 'OVERTIME'
  },
  {
    name: '点球决战',
    key: 'PENALTY_MATCH'
  },
  {
    name: '完场',
    key: 'COMPLETE'
  },
  {
    name: '中断',
    key: 'SUSPEND'
  },
  {
    name: '取消',
    key: 'CANCEL'
  },
  {
    name: '延期',
    key: 'DELAY'
  },
  {
    name: '腰斩',
    key: 'SCRAPPED'
  },
  {
    name: '待定',
    key: 'PENDING'
  },
]


export const matchStageSelectList = [
  {
    name: '联赛',
    key: 'LEAGUE'
  },
  {
    name: '杯赛',
    key: 'CUP'
  },
  {
    name: '友谊赛',
    key: 'FRIENDLY'
  },
]

// 比赛阶段
export enum MatchStage {
  'LEAGUE' = '联赛',
  'CUP' = '杯赛',
  'FRIENDLY' = '友谊赛',
}
