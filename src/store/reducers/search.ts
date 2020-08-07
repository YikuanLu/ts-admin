import { SearchParamsAction, SET_SEARCH_PARAMS } from '@/store/types/search'
import { SearchModal } from '@/models/search'

const initParams:SearchModal = {
  searchParams: {}
}

const commonReducer = (
  state: SearchModal = initParams,
  action: SearchParamsAction
): SearchModal => {
  if (action.type === SET_SEARCH_PARAMS && action.data) {
    const { data } = action
    return {
      searchParams: {
        ...state.searchParams,
        ...data
      }
    }
  }
  return state
}

export default commonReducer
