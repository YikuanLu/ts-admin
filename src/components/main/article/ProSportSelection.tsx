import React, { FC, ReactElement, useState, useEffect } from 'react'
import { Select } from 'antd'
import { AxiosPromise } from 'axios'
import { SelectProps } from 'antd/lib/select'
import { StoreValue } from 'antd/lib/form/interface'
import { uniqBy, isObject, difference } from 'lodash'
import { PolymerItem } from '@/pages/main/article/type'
import { SportType } from '@/pages/main/article/statusType'

const { Option } = Select

interface ProSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [PropsName: string]: any,
  selectProps?: SelectProps<StoreValue>,
  placeholder?: string,
  dataType?: string,
  mode?: 'multiple' | 'tags',
  api: (data: {}) => AxiosPromise,
  onChange?: (data: PolymerItem[]) => void
}

export const ProSportSelection: FC<ProSelectProps> = (Props) => {
  const { api, placeholder = '', onChange, selectProps, value } = Props
  const [polymerList, setList] = useState<PolymerItem[]>([])
  const [toOutData, SetToOutData] = useState<PolymerItem[]>([])
  const onSearchTeamMembers = (val: string | void): void => {
    api({ name: val }).then((res): void => {
      const { data: { content } } = res
      setList(content.map((item: PolymerItem) => (
        { id: item.id, type: item.type, name: item.name }
      )))
    })
  }

  const handelSameItem = (
    outsideData: PolymerItem[]
  ): PolymerItem[] =>
    uniqBy([...polymerList, ...outsideData], 'id')

  const checkDifferenceArrLength = (
    outsideData: PolymerItem[],
    polymerLists: PolymerItem[]): string[] => {
    const paramA = outsideData.map((item): string => JSON.stringify(item))
    const paramB = polymerLists.map((item): string => JSON.stringify(item))
    return difference(paramA, paramB)
  }

  useEffect((): void => {
    let outsideData = []
    let dealData = []
    if (value && value.length > 0) {
      if (isObject(value[0])) {
        outsideData = value
        dealData = value
      } else {
        outsideData = value.map((item: string) => (JSON.parse(item)))
      }
    }
    if (checkDifferenceArrLength(outsideData, toOutData).length > 0) {
      SetToOutData(outsideData.map((item: PolymerItem): PolymerItem => (
        { id: item.id, type: item.type, name: item.name })))
      setList(handelSameItem(dealData))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])


  useEffect((): void => {
    if (onChange) {
      onChange(toOutData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toOutData])
  useEffect((): void => {
    onSearchTeamMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const showContent = (data: PolymerItem): string => `${data.name}(${SportType[data.type]})`

  const createSelectOption = (): React.ReactElement[] =>
    polymerList.map((item: PolymerItem): ReactElement => {
      const { id, type, name } = item
      return (
        <Option
          key={id}
          value={JSON.stringify({ id, type, name })}
        >
          {showContent(item)}
        </Option>
      )
    })

  return (
    <div>
      <Select
        {...selectProps}
        placeholder={placeholder}
        showSearch
        value={toOutData.map((item) => JSON.stringify(item))}
        filterOption={false}
        onSearch={onSearchTeamMembers}
        onBlur={(): void => { onSearchTeamMembers() }}
        allowClear
        onChange={(values: string[]): void => {
          SetToOutData(values.map((item) => JSON.parse(item)))
          if (values === undefined) { onSearchTeamMembers() }
        }}
      >
        {
          createSelectOption()
        }
      </Select>
    </div>
  )
}
