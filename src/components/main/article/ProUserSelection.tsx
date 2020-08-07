import React, { FC, ReactElement, useState, useEffect } from 'react'
import { Select } from 'antd'
import { AxiosPromise } from 'axios'
import { SelectProps } from 'antd/lib/select'
import { StoreValue } from 'antd/lib/form/interface'
import { UserInfoItem } from '@/pages/main/article/type'

const { Option } = Select

interface ProSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [PropsName: string]: any,
  initUsers?: UserInfoItem,
  selectProps?: SelectProps<StoreValue>,
  placeholder?: string,
  dataType?: string,
  articleType?: string,
  mode?: 'multiple' | 'tags',
  api: (data: {}) => AxiosPromise,
  onChange?: (data: string | undefined) => void
}

const vType = { PICTURE: 'COMMUNITY', VIDEO: 'COMMUNITY', INFORMATION: 'INFORMATION' }

export const ProUserSelection: FC<ProSelectProps> = (Props) => {
  const { api, placeholder = '', onChange, selectProps, initUsers, articleType = '' } = Props
  const [userList, setList] = useState<UserInfoItem[]>([])
  const [currentUser, setCurrentUser] = useState<string>()
  const [oldArticleType, setOldArticleType] = useState<string>(articleType)
  const onSearchTeamMembers = (val: string | void): void => {
    // 后端临时增加虚拟用户的解决方案,接口新增字段
    api({ nickname: val, size: 500, vType: vType[articleType] }).then((res): void => {
      const { data: { content } } = res
      setList(content)
      // console.log(teamList)
    })
  }
  useEffect((): void => {
    if (initUsers && Object.keys(initUsers).length > 0) {
      const hasItem = userList.find((item: UserInfoItem): boolean => item.id === initUsers.id)
      setCurrentUser(initUsers.id)
      if (!hasItem) {
        setList([initUsers, ...userList])
      } else {
        setList([...userList])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initUsers])

  useEffect((): void => {
    if (articleType) {
      if (onChange && oldArticleType && vType[oldArticleType] !== vType[articleType]) {
        setCurrentUser('')
        onChange('')
      }
      onSearchTeamMembers()
      setOldArticleType(articleType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleType])

  const createSelectOption = (): React.ReactElement[] =>
    userList.map((item: UserInfoItem): ReactElement => (
      <Option
        key={item.id}
        value={item.id}
      >
        {`[${item.uuid}]${item.nickName}`}
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
        onSearch={onSearchTeamMembers}
        allowClear
        onChange={(values: string): void => {
          if (onChange) {
            setCurrentUser(values)
            onChange(values)
          }
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
