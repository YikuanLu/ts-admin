import React, { FC, ReactElement, useEffect, useState } from 'react'
import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table'
import { ListParams, SearchItem, SelectItem } from '@/components/common/table/types'
import ProTable from '@/components/common/table/proTable'

import { DataRecordModels, DataReordStage } from '@/pages/sport/basketball/dataRecord/models'

import {
  DataReordTransactionTypeEnum,
  DataReordStageEnum,
  dataReordStageSelect,
  dataReordTransactionTypeSelect,
} from './typeData'

import { DataReordTransactionType } from './models'

import {
  getBasketballRecordList,
  getBasketballSeasonList,
  getBasketballMatchList,
  getBasketballTeamList
} from '@/api/sport/basketball'

import style from './style.module.sass'

import NoneWrap from '@/components/common/noneContent'
import ShowName from '@/components/sport/showName'
import { DataProps } from '@/utils/axios'

const api = (data: ListParams): AxiosPromise => getBasketballRecordList<DataRecordModels>(data)

const DataRecord: FC = () => {
  const [seasonList, setSeasonList] = useState([])
  const getSeasonList = (data: ListParams = {}): void => {
    getBasketballSeasonList(data).then((res) => {
      const { content } = res.data
      const arr = content.map(((item: DataProps): SelectItem => ({
        name: item.name, key: item.id
      })))
      setSeasonList(arr)
    })
  }

  const [matchList, setMatchList] = useState([])
  const getMatchList = (data: ListParams = {}): void => {
    getBasketballMatchList(data).then((res) => {
      const { content } = res.data
      const arr = content.map(((item: DataProps): SelectItem => ({
        name: item.name, key: item.id
      })))
      setMatchList(arr)
    })
  }

  const [teamList, setTeamList] = useState([])
  const getTeamList = (data: ListParams = {}): void => {
    getBasketballTeamList(data).then((res) => {
      const { content } = res.data
      const arr = content.map(((item: DataProps): SelectItem => ({
        name: item.name, key: item.id
      })))
      setTeamList(arr)
    })
  }

  useEffect(() => {
    getSeasonList()
    getMatchList()
    getTeamList()
  }, [])

  const searchList: SearchItem[] = [
    {
      name: '赛季',
      type: 'select',
      key: 'seasonId',
      selectList: seasonList,
      onSearch: (data): void => {
        getSeasonList({ name: data })
      }
    },
    {
      name: '所属赛事',
      type: 'select',
      key: 'matchId',
      selectList: matchList,
      onSearch: (data): void => {
        getMatchList({ name: data })
      }
    },
    {
      name: '比赛日期',
      type: 'rangePicker',
      key: 'matchTime',
      rangeDateKey: {
        startTime: 'matchStartTime',
        endTime: 'matchEndTime'
      }
    },
    {
      name: '球员名称',
      type: 'input',
      key: 'playerName',
    },
    {
      name: '所在球队',
      type: 'select',
      key: 'teamId',
      selectList: teamList,
      onSearch: (data): void => {
        getTeamList({ name: data })
      }
    },
    {
      name: '比赛类型',
      type: 'select',
      key: 'stage',
      selectList: dataReordStageSelect
    },
    {
      name: '事务/技术类型',
      type: 'select',
      key: 'transactionType',
      selectList: dataReordTransactionTypeSelect
    },
  ]
  const columns: ColumnsType = [
    {
      title: 'ID',
      width: 80,
      dataIndex: 'id'
    },
    {
      title: '球员',
      width: 130,
      render(value): ReactElement {
        return (
          <div>
            <div className={style.avatar}>
              <img className={style.playerLogo} src={value.playerLogo} alt="" />
              <span>
                {value.playerName}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      title: '事务/技术类型',
      width: 80,
      render(value): ReactElement {
        return (
          <div>
            {
              DataReordTransactionTypeEnum[value.transactionType as DataReordTransactionType]
            }
          </div>
        )
      }
    },
    {
      title: '数值',
      width: 80,
      render(value): ReactElement {
        return (
          <NoneWrap showText={value.num} />
        )
      }
    },
    {
      title: '数值',
      width: 80,
      render(value): ReactElement {
        return (
          <NoneWrap showText={value.position} />
        )
      }
    },
    {
      title: '球队',
      width: 80,
      render(value): ReactElement {
        return (
          <NoneWrap showText={value.teamName} />
        )
      }
    },
    {
      title: '比赛日期',
      width: 80,
      render(value): ReactElement {
        const str = value.scheduleTime?.split(' ')[0] || '暂无数据'
        return (
          <NoneWrap showText={str} />
        )
      }
    },
    {
      title: '比赛类型',
      width: 80,
      render(value): ReactElement {
        const { stage } = value
        const result = DataReordStageEnum[stage as DataReordStage]
        return (
          <NoneWrap showText={result} />
        )
      }
    },
    {
      title: '赛季',
      width: 80,
      render(value): ReactElement {
        return (
          <NoneWrap showText={value.season} />
        )
      }
    },
    {
      title: '赛事',
      width: 200,
      render: (value): ReactElement => {
        const { matchName, matchEnglishName } = value
        return <ShowName name={matchName} englishName={matchEnglishName} />
      }
    },
  ]
  return (
    <div>
      <ProTable
        api={api}
        tableProps={{
          columns,
        }}
        searchList={searchList}
        scrollX={1600}
      />
    </div>
  )
}

export default DataRecord
