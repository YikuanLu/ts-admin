// 比赛阶段
export enum MatchStage {
  'LEAGUE' = '联赛',
  'PRESEASON' = '季前赛',
  'REGULAR' = '常规赛',
  'PLAYOFF' = '季后赛',
  'CHAMPION' = '冠军赛',
  'All_START' = '全明星赛',
}

export const matchStageSelectList = [
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
    name: '冠军赛',
    key: 'CHAMPION'
  },
  {
    name: '全明星赛',
    key: 'All_START'
  },
]


// 比赛状态
export enum MatchStatus {
  'NOT_BEGIN' = '未开赛',
  'ABNORMAL' = '异常',
  'SECTION_ONE' = '第一节',
  'SECTION_ONE_COMPLETE' = '第一节完',
  'SECTION_SECOND' = '第二节',
  'SECTION_SECOND_COMPLETE' = '第二节完',
  'SECTION_THIRD' = '第三节',
  'SECTION_THIRD_COMPLETE' = '第三节完',
  'SECTION_FOURTH' = '第四节',
  'OVERTIME' = '加时',
  'COMPLETE' = '完场',
  'SUSPEND' = '中断',
  'CANCEL' = '取消',
  'DELAY' = '延期',
  'SCRAPPED' = '腰斩',
  'PENDING' = '待定',
}

export const matchStatusSelectList = [
  {
    name: '未开赛',
    key: 'NOT_BEGIN'
  },
  {
    name: '异常',
    key: 'ABNORMAL'
  },
  {
    name: '第一节',
    key: 'SECTION_ONE'
  },
  {
    name: '第一节完',
    key: 'SECTION_ONE_COMPLETE'
  },
  {
    name: '第二节',
    key: 'SECTION_SECOND'
  },
  {
    name: '第二节完',
    key: 'SECTION_SECOND_COMPLETE'
  },
  {
    name: '第三节',
    key: 'SECTION_THIRD'
  },
  {
    name: '第三节完',
    key: 'SECTION_THIRD_COMPLETE'
  },
  {
    name: '第四节',
    key: 'SECTION_FOURTH'
  },
  {
    name: '加时',
    key: 'OVERTIME'
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
