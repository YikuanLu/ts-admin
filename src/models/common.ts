import { Store } from '@/global'

export interface AreaItem {
  label: string,
  value: string,
  children?: AreaItem[],
}
export interface CommonModel {
  areaList: AreaItem[],
  searchParams: Store
}
