// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { FC } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type StoreValue = any;
export interface Store {
  [name: string]: StoreValue;
}

export interface StrMap { [propName: string]: string }

export interface MenuItem {
  name: string,
  key: string,
  subMenu: boolean,
  isShowInMenu?: boolean,
  exact?: boolean,
  path?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes?: MenuItem[]|undefined
  component?: FC,
  parentKey?:string|null,
  from?: string
}
