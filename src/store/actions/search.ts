import { SET_SEARCH_PARAMS } from '@/store/types/search'
import { Store } from '@/global'

export interface ChangeSearchParams {
  type: SET_SEARCH_PARAMS;
  data?: Store;
}

export const setSearchParams = (data:Store):ChangeSearchParams => ({
  type: SET_SEARCH_PARAMS,
  data
})
