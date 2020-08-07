// 文章类型
export const articleTypes = [
  {
    name: '图文',
    key: 'PICTURE'
  },
  {
    name: '视频',
    key: 'VIDEO'
  },
  {
    name: '资讯',
    key: 'INFORMATION'
  },
]

export enum ArtTypes {
  PICTURE = '图文',
  VIDEO = '视频',
  INFORMATION = '资讯',
}

export type artTypes=keyof typeof ArtTypes

// 文章状态
export const articleStatus = [
  {
    name: '未发布',
    key: 'NOT_RELEASE'
  },
  {
    name: '待审核,发布中',
    key: 'TO_BE_REVIEW'
  },
  {
    name: '已审核,发布中',
    key: 'RELEASE'
  },
  {
    name: '已撤回',
    key: 'REVOKED'
  },
]

// 是否引用
export const isQuote = [
  {
    name: '已引用',
    key: 'true'
  },
  {
    name: '未引用',
    key: 'false'
  },
]

export enum StatusText {
  RELEASE = '已审核,发布中',
  NOT_RELEASE = '未发布',
  TO_BE_REVIEW = '待审核,发布中',
  REVOKED = '已撤回',
  TIMED_RELEASE = '定时发布',
}

export enum TextColor {
  RELEASE = 'successColor',
  NOT_RELEASE = 'determinedColor',
  TO_BE_REVIEW = 'determinedColor',
  REVOKED = 'failColor',
  PICTURE = 'determinedColor',
  VIDEO = 'successColor',
  INFORMATION = 'black'
}

export enum RetractType {
  RETRACT = '撤回',
  REPORT = '被举报',
  SENSITIVE_TERMS = '敏感词汇',
}

export enum SortTypes {
  NORMAL = '常规',
  TOP = '置顶',
  RECOMMEND = '推荐',
  HIGH_QUALITY = '优质',
}

export enum SportType{
  FOOTBALL='足球',
  BASKETBALL='篮球',
}
