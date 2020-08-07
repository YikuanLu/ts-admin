import React, { FC, ReactElement } from 'react'
import { AxiosPromise } from 'axios'
import { Link } from 'react-router-dom'
import ProTable from '@/components/common/table/proTable'
import { ListRes, SearchItem } from '@/components/common/table/types'
import { articleTypes, artTypes, ArtTypes } from '@/pages/main/article/statusType'
import NoneWrap from '@/components/common/noneContent'

import style from './style.module.sass'
import { getBlockArticleList } from '@/api/main/shielded'

const api = (data: ListRes): AxiosPromise => getBlockArticleList<ListRes>(data)

interface BlockArticleProps {
  articleId: string
  articleTitle: string
  articleType: string
  blockNum: number
  clickNum: number
  commentNum: number
  giveNum: number
  lastBlockTime: string
  lowQualityNum: number
  seenNum: number
  unInterestedNum: number
}

const ArticleShielded: FC = () => {
  const columns = [
    {
      title: '文章标题',
      width: 200,
      render: (data: BlockArticleProps): ReactElement => {
        const { articleTitle, articleId } = data
        return (
          <Link
            title={articleTitle}
            to={`/article/edit?id=${articleId}`}
            target="_blank"
            className={style.singleText}
          >
            {articleTitle}
          </Link>
        )
      }
    },
    {
      title: '文章类型',
      dataIndex: 'articleType',
      width: 90,
      render: (data: artTypes): ReactElement => (
        <div>{ArtTypes[data]}</div>
      )
    },
    {
      title: '浏览次数',
      dataIndex: 'seenNum',
      sorter: true,
      key: 'seenNum',
      width: 120,
    },
    {
      title: '点赞数',
      dataIndex: 'giveNum',
      sorter: true,
      key: 'giveNum',
      width: 120,
    },
    {
      title: '回复数',
      dataIndex: 'commentNum',
      sorter: true,
      key: 'commentNum',
      width: 120,
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
      title: '不感兴趣',
      dataIndex: 'unInterestedNum',
      sorter: true,
      key: 'unInterestedNum',
      width: 120,
      render: (data: string): ReactElement => (
        <NoneWrap showText={data} />
      )
    },
    {
      title: '已经看过',
      dataIndex: 'seenNum',
      sorter: true,
      key: 'seenNum',
      width: 120,
      render: (data: string): ReactElement => (
        <NoneWrap showText={data} />
      )
    },
    {
      title: '内容质量不佳',
      dataIndex: 'lowQualityNum',
      sorter: true,
      key: 'lowQualityNum',
      width: 120,
      render: (data: string): ReactElement => (
        <NoneWrap showText={data} />
      )
    },
  ]
  const searchList: SearchItem[] = [
    {
      name: '文章类型',
      type: 'select',
      selectList: articleTypes,
      key: 'articleType'
    },
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
        rowKey: 'articleId'
      }}
      scrollX={1200}
      searchList={searchList}
    />
  )
}

export default ArticleShielded
