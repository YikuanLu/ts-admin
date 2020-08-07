import React, { ReactElement } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { Button } from 'antd'
import moment from 'moment'

import NoneWrap from '@/components/common/noneContent'
import { SeasonItem } from '@/pages/main/article/type'


export const columns = (cb: (data: SeasonItem) => void): ColumnsType => [
  {
    title: '赛事',
    align: 'left',
    width: 40,
    dataIndex: 'matchShortName',
  },
  {
    title: '比赛时间',
    align: 'left',
    width: 120,
    dataIndex: 'startTime',
    render: (values): ReactElement => (
      values
        ? <div>{moment(values).format('YYYY年MM月DD日 HH:mm')}</div>
        : <NoneWrap showText="" />
    )
  },
  {
    title: '对阵',
    align: 'left',
    width: 120,
    render: (values): ReactElement => {
      const { homeTeamName, guestTeamName, matchShortName } = values
      const hometeam = matchShortName === 'NBA' ? guestTeamName : homeTeamName
      const guestTeam = matchShortName === 'NBA' ? homeTeamName : guestTeamName
      return (<div>{`${hometeam} VS ${guestTeam}`}</div>)
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
