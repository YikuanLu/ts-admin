import React, { FC, useEffect, ReactElement, useState } from 'react'
import { Modal, Button, message } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import moment from 'moment'
import { AddMatchListProps } from '@/components/main/article/AddMatchList/matchList'
import style from '@/components/main/article/AddMatchList/style.module.sass'
import { sportSchedule } from '@/api/sport/base'
import NoneWrap from '@/components/common/noneContent'
import { SeasonItem } from '@/pages/main/article/type'
import { ListRes, SearchItem } from '@/components/common/normalTable/types'
import NormalTable from '@/components/common/normalTable'

const api = (data: ListRes): AxiosPromise => sportSchedule<ListRes>(data)


const AddMatchList: FC<AddMatchListProps> = (props: AddMatchListProps) => {
  const { onChange, matchSearchList, value } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [matchList, saveMatchList] = useState<SeasonItem[]>([])
  useEffect((): void => {
    if (onChange) {
      onChange(matchList.map((item: SeasonItem): {} => ({ type: item.type, id: item.id })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchList])
  useEffect((): void => {
    if (value && value.length > 0) {
      if (Object.keys(value[0]).length > 2) {
        saveMatchList(value)
      }
    }
  }, [value])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    saveMatchList(matchList.filter((item: SeasonItem): boolean => item.id !== data.id))
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
      rangeDateKey: {
        startTime: 'startTime',
        endTime: 'endTime'
      },
      disabledTime: {
        minTime: moment()
      },
      initData: [moment(`${moment().subtract(30, 'days').format('YYYY-MM-DD')} 00:00:00`), moment(`${moment().format('YYYY-MM-DD')} 23:59:59`)]
    },
  ]
  const columns: ColumnsType = [
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
      width: 80,
      render: (values): ReactElement => (
        <div>
          <Button
            type="primary"
            size="small"
            onClick={(): void => {
              sendMessage(values)
            }}
          >
            添加
          </Button>
        </div>
      )
    }
  ]
  return (
    <div>
      <div className={style.btnList}>
        {
          matchList.map((values: SeasonItem): ReactElement => {
            const {
              startTime,
              homeTeamName,
              guestTeamName,
              id,
              matchShortName,
              type
            } = values
            const hometeam = type === 'FOOTBALL' ? guestTeamName : homeTeamName
            const guestTeam = type === 'FOOTBALL' ? homeTeamName : guestTeamName
            return (
              <div key={id} className={style.btn}>
                <p>{`${matchShortName} ${moment(startTime).format('YYYY年MM月DD日 HH:mm')} ${hometeam} VS ${guestTeam}`}</p>
                <span onClick={(): void => { deleteSeason(values) }}>X</span>
              </div>
            )
          }
          )
        }
      </div>
      <Button
        className={style.addBtn}
        onClick={(): void => { setModalVisible(true) }}
      >
        添加比赛
      </Button>
      <Modal
        width="60%"
        title="添加比赛"
        visible={modalVisible}
        destroyOnClose
        footer={null}
        onCancel={(): void => { setModalVisible(false) }}
      >
        <NormalTable
          searchList={searchList}
          api={api}
          tableProps={{ columns }}
          scrollX={900}
        />
      </Modal>
    </div>
  )
}
export default AddMatchList
