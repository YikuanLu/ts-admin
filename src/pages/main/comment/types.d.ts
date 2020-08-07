
export interface ModalProps {
  visible: boolean,
  itemData?: StoreValue,
  cancelFn: () => void,
  updataList: (val?: StoreValue) => void
}

export type ReplyType = 'COMMENT' | 'QUOTE' | 'ARTICLE' | ''

export interface ReplyModalProps extends ModalProps {
  type:ReplyType
}

// 排序状态
export type SortTypes = 'TOP' | 'RECOMMEND' | 'COMMON'

// 屏蔽状态
export type ShieldTypes = 'REPORT' | 'TACTFUL' | 'DELETE'

//
export type RetractTypes = 'RETRACT' | 'REPORT' | 'SENSITIVE_TERMS'
