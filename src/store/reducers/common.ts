import { CommonAction, SET_AREA_INFOR } from '@/store/types/common'
import { CommonModel } from '@/models/common'

const initInfor = {
  areaList: [],
  searchParams: {},
  axiosCancelTokenStore: []
}

const commonReducer = (
  state: CommonModel = initInfor,
  action: CommonAction
): CommonModel => {
  if (action.type === SET_AREA_INFOR && action.areaList) {
    const { areaList } = action
    return { ...state, areaList }
  }
  return state
}

export default commonReducer
