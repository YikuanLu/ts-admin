import React, { FC, ReactElement } from 'react'
import { AxiosPromise } from 'axios'
import { Link } from 'react-router-dom'
import ProTable from '@/components/common/table/proTable'
import { ListRes, SearchItem } from '@/components/common/table/types'
import NoneWrap from '@/components/common/noneContent'

import { getBlockTopicList } from '@/api/main/shielded'

const api = (data: ListRes): AxiosPromise => getBlockTopicList<ListRes>(data)

interface BlockTopicProps {
  articleNum: string
  blockNum: number
  followNum: number
  lastBlockTime: string
  lowQualityNum: number
  seenNum: number
  subjectId: string
  subjectName: string
  unInterestedNum: number
}

const TopicShielded: FC = () => {
  const columns = [
    {
      title: '被屏蔽话题',
      width: 200,
      dataIndex: 'subjectName',
      render: (data: number): ReactElement => (
        <span>{`#${data}`}</span>
      )
    },
    {
      title: '关注用户数',
      dataIndex: 'followNum',
      width: 120,
    },
    {
      title: '文章数',
      dataIndex: 'articleNum',
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
      render: (data: string): ReactElement => (
        <NoneWrap showText={data} />
      )
    },
    {
      title: '可用操作',
      width: 120,
      render: (data: BlockTopicProps): ReactElement => {
        const { subjectName } = data
        return (
          <Link target="_blank" to={`/article?topicName=${subjectName}`}>相关文章</Link>
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
        rowKey: 'subjectId'
      }}
      searchList={searchList}
      scrollX={1500}
    />
  )
}

export default TopicShielded
