export enum StatusEnum {
  SOLVE = '已受理',
  UNSOLVED = '待受理'
}

export enum ReportResultEnum {
  RETRACT = '撤回文章',
  DISABLE_USER = '撤回文章，并禁用作者',
  IGNORE = '无效举报，忽略',
}
