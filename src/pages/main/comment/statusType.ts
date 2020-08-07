import { SortTypes, ShieldTypes } from '@/pages/main/comment/types'

interface SortTypeItem<T> {
  name: string,
  key: T
}

export const sortTypes: SortTypeItem<SortTypes>[] = [
  {
    name: '常规排序',
    key: 'COMMON'
  },
  {
    name: '推荐排序',
    key: 'RECOMMEND'
  },
  {
    name: '置顶排序',
    key: 'TOP'
  }
]

export const shieldTypes: SortTypeItem<ShieldTypes>[] = [
  {
    name: '被举报',
    key: 'REPORT'
  },
  {
    name: '敏感词汇',
    key: 'TACTFUL'
  },
  {
    name: '删除',
    key: 'DELETE'
  }
]

export const commentStatus = [
  {
    name: '待审核，发布中',
    key: '1'
  },
  {
    name: '已审核，发布中',
    key: '2'
  },
  {
    name: '已屏蔽',
    key: '-1'
  }
]

export enum ShieldReason {
  'REPORT' = '被举报',
  'TACTFUL' = '敏感词汇',
  'DELETE' = '删除',
}

export enum SortTypeStr {
  'COMMON' = '常规',
  'RECOMMEND' = '推荐',
  'TOP' = '置顶',
}

export const retractTypeList = [
  {
    name: '撤回',
    key: 'RETRACT'
  },
  {
    name: '被举报',
    key: 'REPORT'
  },
  {
    name: '敏感词汇',
    key: 'SENSITIVE_TERMS'
  }
]

export enum RetractTypeStr {
  'RETRACT' = '撤回',
  'REPORT' = '被举报',
  'SENSITIVE_TERMS' = '敏感词汇',
}
