import React, { FC, ReactElement, useState, useEffect } from 'react'
import { Select } from 'antd'
import { AxiosPromise } from 'axios'
import { SelectProps } from 'antd/lib/select'
import { StoreValue } from 'antd/lib/form/interface'
import { isObject, uniqBy } from 'lodash'
import { TagItem } from '@/pages/main/article/type'

const { Option } = Select

interface ProSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [PropsName: string]: any,
  value?: TagItem;
  selectProps?: SelectProps<StoreValue>,
  placeholder?: string,
  dataType?: string,
  mode?: 'multiple' | 'tags',
  api: (data: {}) => AxiosPromise,
  onChange?: (data: string | undefined) => void
}


export const ProTopicSelection: FC<ProSelectProps> = (Props) => {
  const { api, placeholder = '', onChange, selectProps, value } = Props
  const [showList, setList] = useState<TagItem[]>([])
  const [initData, setInitData] = useState<TagItem>({} as TagItem)
  const [currentUser, setCurrentUser] = useState<string>('')
  const handelSameItem = (outsideData: TagItem[]): TagItem[] =>
    uniqBy(outsideData, 'id')

  const onSearchTopicList = (val: string | void): void => {
    api({ name: val }).then((res): void => {
      const { data: { content } } = res
      if (Object.keys(initData).length > 0) {
        setList(handelSameItem([initData, ...content]))
      } else {
        setList(handelSameItem(content))
      }
      // console.log(teamList)
    })
  }

  useEffect((): void => {
    onSearchTopicList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect((): void => {
    if (isObject(value)) {
      setInitData(value)
      setCurrentUser(value.id)
      setList(handelSameItem([value, ...showList]))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  useEffect((): void => {
    if (onChange && currentUser) {
      onChange(currentUser)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  const createSelectOption = (): React.ReactElement[] =>
    showList.map((item: TagItem): ReactElement => (
      <Option
        key={item.id}
        value={item.id}
      >
        {`# ${item.name}`}
      </Option>
    ))

  return (
    <div>
      <Select
        {...selectProps}
        placeholder={placeholder}
        showSearch
        value={currentUser}
        filterOption={false}
        onSearch={onSearchTopicList}
        allowClear
        onChange={(values: string): void => {
          if (onChange) {
            onChange(values)
            setCurrentUser(values)
          }
          if (values === undefined) { onSearchTopicList() }
        }}
      >
        {
          createSelectOption()
        }
      </Select>
    </div>
  )
}
