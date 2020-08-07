import React, { FC, ReactElement, useState, useEffect } from 'react'
import { Select } from 'antd'
import { AxiosPromise } from 'axios'
import { SelectProps } from 'antd/lib/select'
import { StoreValue } from 'antd/lib/form/interface'
import { uniqBy } from 'lodash'
import { TagItem } from '@/pages/main/article/type'

const { Option } = Select

interface ProSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [PropsName: string]: any,
  selectProps?: SelectProps<StoreValue>,
  placeholder?: string,
  dataType?: string,
  mode?: 'multiple' | 'tags',
  api: (data: {}) => AxiosPromise,
  onChange?: (data: TagItem[]) => void
}


export const ProLablesSelection: FC<ProSelectProps> = (Props) => {
  const { api, placeholder = '', onChange, selectProps, value } = Props
  const [showList, setList] = useState<TagItem[]>([])
  const [initData, setInitData] = useState<TagItem[]>([])
  const [currentUser, setCurrentUser] = useState<TagItem[]>([])
  // 合并到总的列表里面,去除重复的项
  const handelSameItem = (outsideData: TagItem[]): TagItem[] =>
    uniqBy(outsideData, 'id')

  const onSearchTopicList = (val: string | void): void => {
    api({ name: val, enabled: true, size: 500 }).then((res): void => {
      const { data: { content } } = res
      // if(currentUser.length>0)
      setList(handelSameItem([...content, ...currentUser]))
    })
  }

  useEffect((): void => {
    onSearchTopicList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect((): void => {
    if (value && value.length > 0) {
      if (handelSameItem([...value, ...initData]).length > 0) {
        setInitData(value)
        setCurrentUser(value)
      }
      setList(handelSameItem([...showList, ...value]))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect((): void => {
    if (onChange) {
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
        {`${item.name}(${item.groupName})`}
      </Option>
    ))

  return (
    <div>
      <Select
        {...selectProps}
        placeholder={placeholder}
        showSearch
        value={currentUser.map((item: TagItem): string => item.id)}
        filterOption={false}
        onSearch={onSearchTopicList}
        onBlur={(): void => { onSearchTopicList() }}
        allowClear
        onChange={(values): void => {
          if (values.length > 0) {
            // eslint-disable-next-line array-callback-return
            const data = values.map((item: string): TagItem | undefined =>
              showList.concat(currentUser).find((items: TagItem) => items.id === item))
            setCurrentUser(data.filter((item: string | undefined): boolean => !!item))
          } else {
            setCurrentUser([])
          }
          // setCurrentUser(values)
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
