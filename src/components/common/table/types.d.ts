// import { Ref } from 'react'
import React, { ReactElement } from 'react'
import { TableProps } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import { TableRowSelection } from 'antd/lib/table/interface'
import { StoreValue } from 'antd/lib/form/interface'

export type SearchType = 'input' | 'select' | 'rangePicker' | 'datePicker' | 'number' | 'dayePicker'

export interface AnyProps { [propName: string]: StoreValue }

export interface SelectItem {
  name: string,
  key: string | number,
}

export interface SearchItem {
  name: string,
  key: string,
  type: SearchType,
  selectList?: SelectItem[],
  rangeDateKey?: { startTime: string, endTime: string },
  disable?: boolean,
  isFilter?: boolean,
  showTime?: boolean,
  onChange?: (val: StoreValue) => void,
  onSearch?: (val: string) => void,
}

export interface ListRes<T = StoreValue> {
  page: number,
  size: number,
  count: number,
  content: T[],
}

export interface ProTableProps {
  overrideSearchParams?: Store, // 外部传入覆盖搜索条件的参数
  headerBtnGroup?: ReactElement, // 顶部按钮（添加按钮之类的）
  tableProps: TableProps<StoreValue>, // antd列表原参数
  searchList?: SearchItem[], // 搜索列表项
  filterElement?: ReactElement, // 列表上方外部元素（类似tab）
  scrollX?: number, // 列表宽度
  filterProps?: Store, // 从外部传入的筛选条件（类似tab）
  selectdCount?: number, // 已勾选条数
  searchParams?: Store, // redux 参数
  unInitData?: boolean, // 是否不执行初始化请求（用于请求由组件外部发起的情况）
  tabData?: {
    key: string,
    list: SelectItem[]
  },
  tabValueChange?: (val: string) => void, // 当tab的值发生变化时候的回调
  setSearchParams?: (searchModal: Store) => void, // redux方法
  api: (data: StoreValue) => AxiosPromise<T> // 请求列表接口
  changePage?: (number) => void, // 列表页码变化传出方法
  patchClearSelect?: () => void, // 清除勾选项方法
}

export interface ListParams {
  page?: number,
  size?: number,
  desc?: boolean,
  sortFieldName?: string,
  [propName: string]: string | number | undefined,
}

interface SearchFormProps {
  overrideSearchParams?: Store,
  onSearch: (val: AnyProps) => void, // 触发搜索回调
  searchList: SearchItem[],
  filterParams?: object,
  searchParams?: Store,
  setSearchParams?: (searchModal: Store) => void,
  headerBtnGroup?: ReactElement
}
