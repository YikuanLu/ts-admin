import Moment from 'moment'
import { isObject } from 'lodash'
import { AnyProps, SearchItem } from '@/components/common/table/types'

interface ParamObj {
  id?: string;
  type?: string;
  [props: string]: string | number | undefined | null;
}

export const getParamObj = (str: string): ParamObj => {
  const result = decodeURI(str)
    .replace(/&/g, '","')
    .replace(/=/g, '":"')
    .replace(/\?/g, '')
  const reqDataString = `{"${result}"}`
  try {
    return JSON.parse(reqDataString)
  } catch (error) {
    // return false
    return {}
  }
}

export const processData = (
  data: AnyProps,
  searchList: SearchItem[]
): AnyProps => {
  const result = data
  const keys = Object.keys(data)
  keys.forEach((item) => {
    // 转换时间格式
    if (data[item] instanceof Moment) {
      result[item] = Moment(data[item]).format('YYYY-MM-DD HH:mm:ss')
    }
    const dayPicker = searchList.find((ele) => ele.key === item)
    if (dayPicker?.type === 'dayePicker' && data[item] !== null) {
      result[item] = Moment(data[item]).format('YYYY-MM-DD')
    }

    // 处理表单为<开始时间｜结束时间>的属性的字段名
    if (data[item] instanceof Array) {
      const defaultRangePickerMap = {
        rangeDateKey: {
          startTime: 'startTime',
          endTime: 'endTime'
        }
      }
      const rangePickerMap = searchList.find((ele) => ele.key === item) || defaultRangePickerMap
      const startKey = rangePickerMap.rangeDateKey?.startTime || 'startTime'
      const endKey = rangePickerMap.rangeDateKey?.endTime || 'endTime'
      result[startKey] = `${Moment(data[item][0]).format(
        'YYYY-MM-DD'
      )} 00:00:00`
      result[endKey] = `${Moment(data[item][1]).format('YYYY-MM-DD')} 23:59:59`
      delete result[item]
    }
  })
  return result
}

interface ObjectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propsName: string]: any;
}
// 检测两个对象是否一致(非检测引用地址,检测引用地址直接使用Object.is()即可)
export const isObjectValueEqual = (a: ObjectProps, b: ObjectProps): boolean => {
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    const propA = a[propName]
    const propB = b[propName]
    if (typeof propA === 'object') {
      if (isObjectValueEqual(propA, propB)) {
        // return true     这里不能return ,后面的对象还没判断
      } else {
        return false
      }
    } else if (propA !== propB) {
      return false
    }
  }
  return true
}

// 清空复杂对象中的所有(null/undefined/0/false)字段
export const clearObj = (obj: ObjectProps): ObjectProps => {
  // console.log(obj)
  const newObj: ObjectProps = {}
  const aProps = Object.getOwnPropertyNames(obj)
  for (let i = 0; i < aProps.length; i++) {
    const propName: string = aProps[i]
    const propA = obj[propName]
    if (!!propA && !isObject(propA)) {
      newObj[propName] = propA
    }
    if (isObject(propA)) {
      if (Object.keys(propA).length > 0) {
        newObj[propName] = clearObj(propA)
      } else {
        newObj[propName] = propA
      }
    }
  }
  return newObj
  // console.log(newObj)
}

// 格式化时间
export const formatDate = (data: string): string => Moment(data).format('YYYY-MM-DD')


export const parserInputNumber = (unit: string) => (value: string | undefined): string => {
  if (value) {
    return value.replace(unit, '')
  }
  return `0${unit}`
}

export const formatInputNumber = (unit: string) => (value: string | undefined | number): string => {
  if (!value) {
    return `0${unit}`
  }
  return `${value}${unit}`
}
