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

// 审核状态
export const articleStatus = [
  {
    name: '未审核',
    key: 'CREATE'
  },
  {
    name: '审核成功',
    key: 'AUDIT'
  },
  {
    name: '审核不通过',
    key: 'AUDIT_FAIL'
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

// 素材处理状态
export const materialTypesList = [
  {
    name: '未处理',
    key: 'CREATE'
  },
  {
    name: '已处理',
    key: 'AUDIT'
  },
]
export enum MaterialTypes {
  'CREATE' = '未处理',
  'AUDIT' = '已处理',
}

export enum StatusText {
  CREATE = '未审核',
  AUDIT = '审核成功',
  AUDIT_FAIL = '审核不通过',
}
