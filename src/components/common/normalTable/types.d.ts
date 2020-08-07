// import { Ref } from 'react'
import React, { ReactElement } from 'react'
import { TableProps } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import Moment from 'moment'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AnyProps { [propName: string]: any }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ListRes<T = any> {
  page: number,
  size: number,
  count: number,
  content: T[],
}

export interface ProTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableProps: TableProps<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: (data: any) => AxiosPromise<T>
  // initSearchData该字段存储对象不影响searchList中的字段默认值,优先级低于searchList
  initSearchData?: DataProps,
  searchList?: SearchItem[],
  filterElement?: ReactElement,
  scrollX?: number,
  changePage?: (number) => void,
}

export interface ListParams {
  page?: number,
  size?: number,
  desc?: boolean,
  sortFieldName?: string,
  [propName:string]: string | number,
}

export interface SearchItem {
  name: string,
  key: string,
  type: SearchType,
  selectList?: SelectItem[],
  rangeDateKey?: { startTime: string, endTime: string },
  disable?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (val: any) => void,
  isFilter?: boolean=true,
  onSearch?: (val: string) => void,
  disabledTime?:{minTime?:moment, maxTime?:moment},
  initData?: Moment | Moment[] | string | number,
  rangePickerFormat?:string
}

export interface SelectItem {
  name: string,
  key: string,
}
