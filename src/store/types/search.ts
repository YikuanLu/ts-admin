
import { Store } from '@/global'

export const SET_SEARCH_PARAMS = 'SET_SEARCH_PARAMS'
export type SET_SEARCH_PARAMS = typeof SET_SEARCH_PARAMS // 写入列表搜索条件

export interface SearchParamsAction {
  type: typeof SET_SEARCH_PARAMS;
  data: Store;
}
