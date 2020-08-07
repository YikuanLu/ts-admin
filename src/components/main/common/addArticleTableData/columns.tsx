import React, { ReactElement } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { Button } from 'antd'

import NoneWrap from '@/components/common/noneContent'
import { ArticleItem } from '@/pages/main/article/type'
import { Status } from '@/pages/main/type'
import { TextColor, StatusText } from '@/pages/main/article/statusType'

import style from './style.module.sass'

export const columns = (cb: (data: ArticleItem) => void): ColumnsType => [
  {
    title: '文章标题',
    align: 'left',
    width: 120,
    dataIndex: 'title',
    render: (value): ReactElement => (
      <p title={value} className={style.hidden}>{value}</p>
    )
  },
  {
    title: '创建时间',
    align: 'left',
    width: 80,
    dataIndex: 'createTime',
  },
  {
    title: '最后修改时间',
    align: 'left',
    width: 80,
    dataIndex: 'updateTime',
    render: (value): ReactElement => (
      <NoneWrap showText={value} />
    )
  },
  {
    title: '状态',
    align: 'center',
    width: 60,
    render: (value): ReactElement => {
      const showStatus: Status = value.status
      const textColor: string = TextColor[showStatus]
      return (
        <div className={style[textColor]}>{StatusText[showStatus]}</div>
      )
    }
  },
  {
    title: '操作',
    fixed: 'right',
    align: 'center',
    width: 30,
    render: (values): ReactElement => (
      <div>
        <Button
          type="primary"
          size="small"
          onClick={(): void => {
            cb(values)
          }}
        >
          添加
        </Button>
      </div>
    )
  }
]
