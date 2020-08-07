import { AreaItem } from '@/models/common'

export const SET_AREA_INFOR = 'SET_AREA_INFOR'
export type SET_AREA_INFOR = typeof SET_AREA_INFOR // 写入地区信息


export interface CommonAction {
  type: typeof SET_AREA_INFOR;
  areaList?: AreaItem[];
}
