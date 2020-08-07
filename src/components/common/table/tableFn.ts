import { StoreValue } from '@/global'
import { SelectItem } from './types'

interface TabData {
  key: string;
  list: SelectItem[];
}

export const setTabDefaultVal = (
  resultData: StoreValue,
  tabData?: TabData
): string => ((tabData && resultData[tabData?.key])
  ? resultData[tabData.key]
  : 'UNDEFINED')
