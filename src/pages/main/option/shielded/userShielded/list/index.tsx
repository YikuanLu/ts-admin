import React, { FC, ReactElement } from 'react'
import { AxiosPromise } from 'axios'
import { Link } from 'react-router-dom'
import ProTable from '@/components/common/table/proTable'
import { ListRes, SearchItem } from '@/components/common/table/types'
import NoneWrap from '@/components/common/noneContent'

import { getBlockUserList } from '@/api/main/shielded'

const api = (data: ListRes): AxiosPromise => getBlockUserList<ListRes>(data)

interface BlockUserProps {
  articleNum: number
  blockNum: number
  lastBlockTime: string
  lowQualityNum: number
  nickName: string
  registerTime: string
  seenNum: number
  unInterestedNum: number
  userId: string
  uuid: string
}

const UserShielded: FC = () => {
  const columns = [
    {
      title: '被屏蔽用户',
      width: 200,
      render: (data: BlockUserProps): ReactElement => {
        const { uuid, nickName } = data
        return (
          <div>{`[${uuid}]${nickName}`}</div>
        )
      }
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      width: 120,
    },
    {
      title: '发帖量',
      dataIndex: 'articleNum',
      sorter: true,
      key: 'articleNum',
      width: 120,
      render: (data: string): ReactElement => (
        <NoneWrap showText={data} />
      )
    },
    {
      title: '屏蔽用户数',
      dataIndex: 'blockNum',
      sorter: true,
      key: 'blockNum',
      width: 120,
    },
    {
      title: '可用操作',
      width: 120,
      render: (data: BlockUserProps): ReactElement => {
        const { uuid } = data
        return (
          <Link target="_blank" to={`/article?authorUserName=${uuid}`}>相关文章</Link>
        )
      }
    },
  ]
  const searchList: SearchItem[] = [
    {
      name: '时间',
      type: 'select',
      selectList: [
        {
          name: '3天内',
          key: 'DAY3'
        },
        {
          name: '5天内',
          key: 'DAY5'
        },
        {
          name: '7天内',
          key: 'DAY7'
        },
        {
          name: '15天内',
          key: 'DAY15'
        },
        {
          name: '30天内',
          key: 'DAY30'
        },
        {
          name: '3个月',
          key: 'MONTH3'
        },
        {
          name: '半年',
          key: 'HALF_YEAR'
        },
        {
          name: '一年',
          key: 'ONE_YEAR'
        },
      ],
      key: 'timeFrame'
    },
  ]
  return (
    <ProTable
      api={api}
      tableProps={{
        columns,
        rowKey: 'userId'
      }}
      searchList={searchList}
      scrollX={1500}
    />
  )
}

export default UserShielded
