import React, { FC, useEffect, ReactElement, useState } from 'react'
import { Modal, Button, message } from 'antd'
import { AxiosPromise } from 'axios'
import moment from 'moment'
import { isEqual } from 'lodash'
import { AddMatchListProps } from '@/components/main/common/addTableData/type'
import style from '@/components/main/article/AddMatchList/style.module.sass'
import { sportSchedule, sportScheduleList } from '@/api/sport/base'
import { SeasonItem, PolymerItem } from '@/pages/main/article/type'
import { ListRes, SearchItem } from '@/components/common/normalTable/types'
import NormalTable from '@/components/common/normalTable'
import { columns } from '@/components/main/common/addTableData/columns'

const api = (data: ListRes): AxiosPromise => sportSchedule<ListRes>(data)

const AddMatchList: FC<AddMatchListProps> = (props: AddMatchListProps) => {
  const {
    onChange,
    value,
    initData, disabledTime, isSingle = true,
    rangePickerFormat = 'YYYY-MM-DD HH:mm:ss' } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [matchList, saveMatchList] = useState<SeasonItem[]>([])
  const [matchSearchList, setMatchSearchList] = useState<PolymerItem[]>([])

  // 获取体育项目下的赛事的平铺数据
  const getSportsSeasonList = (): void => {
    sportScheduleList({
      size: 500
    }).then((res): void => {
      const { data } = res
      setMatchSearchList(data as PolymerItem[])
    })
  }

  useEffect(() => {
    getSportsSeasonList()
  }, [])

  useEffect((): void => {
    if (onChange) {
      onChange(matchList.map((item: SeasonItem): {} => ({
        ...item
      })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchList])

  useEffect((): void => {
    if (!value || !matchList || value.length === 0) return
    if (!isEqual(value, matchList)) {
      saveMatchList(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const sendMessage = (data: SeasonItem): void => {
    const oldArrLength = matchList.length
    const newArrLength = matchList.filter((item: SeasonItem): boolean =>
      item.id + item.type !== data.id + data.type).length
    setModalVisible(false)
    if (oldArrLength !== newArrLength) {
      message.error('已关联该比赛')
    } else {
      message.success('添加关联比赛成功')
      saveMatchList([...matchList, data])
    }
  }

  const deleteSeason = (data: SeasonItem): void => {
    saveMatchList(matchList.filter(
      (item: SeasonItem): boolean => item.id !== data.id)
    )
  }

  const searchList: SearchItem[] = [
    {
      name: '赛事',
      type: 'select',
      key: 'matchId',
      selectList: matchSearchList.map((items) => ({ ...items, key: items.id }))
    },
    {
      name: '比赛日期',
      type: 'rangePicker',
      key: 'releaseTime',
      rangePickerFormat,
      rangeDateKey: {
        startTime: 'startTime',
        endTime: 'endTime'
      },
      disabledTime,
      initData
    },
  ]

  // 展示当前选中的
  const currentMatch = (data: SeasonItem): ReactElement => {
    const {
      startTime,
      homeTeamName,
      guestTeamName,
      matchShortName,
      type
    } = data
    const hometeam = type === 'FOOTBALL' ? guestTeamName : homeTeamName
    const guestTeam = type === 'FOOTBALL' ? homeTeamName : guestTeamName
    const time = isSingle ? '' : moment(startTime).format('YYYY年MM月DD日 HH:mm')
    return (
      <div className={style.btn}>
        <p>
          {`${matchShortName} ${time} ${hometeam} VS ${guestTeam}`}
        </p>
        <span onClick={(): void => { deleteSeason(data) }}>X</span>
      </div>
    )
  }

  const isShowAddBtn = (): ReactElement | null => {
    if (isSingle) {
      if (matchList.length > 0) return null
    }
    return (
      <Button
        type="primary"
        onClick={(): void => { setModalVisible(true) }}
      >
        添加比赛
      </Button>
    )
  }
  return (
    <div>
      <div className={style.btnList}>
        {
          matchList.map((values: SeasonItem): ReactElement => (
            <div key={values.id}>
              {currentMatch(values)}
            </div>
          ))
        }
      </div>
      {isShowAddBtn()}
      <Modal
        width="50%"
        title="添加比赛"
        visible={modalVisible}
        destroyOnClose
        footer={null}
        onCancel={(): void => { setModalVisible(false) }}
      >
        <NormalTable
          searchList={searchList}
          api={api}
          tableProps={{ columns: columns(sendMessage) }}
          scrollX={900}
        />
      </Modal>
    </div>
  )
}
export default AddMatchList
