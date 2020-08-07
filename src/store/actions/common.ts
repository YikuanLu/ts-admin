import { SET_AREA_INFOR } from '@/store/types/common'
import { AreaItem } from '@/models/common'

export interface ChangeAreaListAction {
  type: SET_AREA_INFOR;
  areaList?: AreaItem[];
}

export const setAreaList = (areaList: AreaItem[]): ChangeAreaListAction => ({
  type: SET_AREA_INFOR,
  areaList
})
