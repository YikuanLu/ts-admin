import React, { useRef, MutableRefObject, ReactElement, useState, useEffect } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { ListParams, SearchItem } from '@/components/common/table/types'
import { getFootballSeasonList, getFootballMatchList } from '@/api/sport/football'
import { SeasonItem, FootballMatchItem } from '../../types'
import ShowName from '@/components/sport/showName'
import NoneWrap from '@/components/common/noneContent'

const api = (data: ListParams): AxiosPromise => getFootballSeasonList(data)

interface SelectItem {
  name: string,
  key: string,
}

const SeasonList: React.FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const [selectList, setSelectList] = useState<SelectItem[]>()
  useEffect((): void => {
    getFootballMatchList({ size: 20 }).then((res): void => {
      const { content = [] } = res.data
      const arr = content.map(
        ((item: FootballMatchItem): SelectItem => (
          { name: item.shortName, key: item.id }
        ))
      )
      setSelectList(arr)
    })
  }, [])

  const columns: ColumnsType = [
    {
      title: 'ID',
      width: 130,
      dataIndex: 'id',
    },
    {
      title: '赛季名称',
      width: 200,
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '开始时间',
      width: 200,
      align: 'center',
      dataIndex: 'startTime',
      render: (value: string): ReactElement => <NoneWrap showText={value} />
    },
    {
      title: '截止时间',
      width: 200,
      align: 'center',
      dataIndex: 'endTime',
      render: (value: string): ReactElement => <NoneWrap showText={value} />
    },
    {
      title: '所属赛事',
      width: 200,
      align: 'center',
      render: (value: SeasonItem): ReactElement => {
        const { matchLogo, matchName, matchEnglishName } = value
        return <ShowName logo={matchLogo} name={matchName} englishName={matchEnglishName} />
      }
    },
  ]
  const searchList: SearchItem[] = [
    {
      name: '赛季名称',
      type: 'input',
      key: 'name'
    },
    {
      name: '所属赛事',
      type: 'select',
      key: 'matchId',
      isFilter: false,
      selectList,
      onSearch: (data): void => {
        getFootballMatchList({ name: data }).then((res): void => {
          const { content = [] } = res.data
          const arr = content.map(
            ((item: FootballMatchItem): SelectItem => (
              { name: item.shortName, key: item.id }
            ))
          )
          setSelectList(arr)
        })
      }
    },
    {
      name: '赛季日期',
      type: 'rangePicker',
      key: 'createTime',
      rangeDateKey: {
        startTime: 'startTime',
        endTime: 'endTime'
      }
    },
  ]

  return (
    <div>
      <ProTable
        ref={tableRef}
        api={api}
        scrollX={1000}
        tableProps={{ columns }}
        searchList={searchList}
      />
    </div>
  )
}

export default SeasonList
