export enum ReportType {
  'ILLEGAL' = '发布违法信息',
  'INVOLVING_YELLOW' = '发布涉黄、低俗信息',
  'VIOLENCE' = '传播暴力、血腥信息',
  'TORT' = '侵权（个人隐私泄露、侮辱谩骂、诽谤诋毁）',
  'OTHER' = '其他',
}

export enum SolveStatus {
  'UNSOLVED' = '待受理',
  'SOLVE' = '已受理'
}

export type solveStatus = keyof typeof SolveStatus

export type reportType = keyof typeof ReportType

export type AcceptanceResultType = 'RETRACT'|'DISABLE_USER'|'IGNORE'
