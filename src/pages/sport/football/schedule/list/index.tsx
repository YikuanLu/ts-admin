import React, {
  FC,
  ReactElement,
  useRef,
  useState
} from 'react'
import zhCN from 'antd/es/locale/zh_CN'
import { Button, Modal, ConfigProvider, message } from 'antd'
import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table/interface'

import { ExclamationCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import {
  FootballMatchItem,
  FootballPlayerItem,
  FootballScheduleItem
} from '@/pages/sport/football/types'

import {
  matchStatusSelectList, MatchStatus,
} from '@/pages/sport/football/typeData'

import { SearchItem, ListParams, SelectItem } from '@/components/common/table/types'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'

import {
  getFootballScheduleList,
  getFootballMatchList,
  getFootballTeamList,
  updateFootballcheduleItem
} from '@/api/sport/football'

import {
  deleteScheduleItem,
} from '@/api/sport/base'

import NoneWrap from '@/components/common/noneContent'
import BattleTeams from '@/components/sport/battleTeams'

import ScheduleEdit, { ModalEditHandles } from '@/pages/sport/football/schedule/edit'

const api = (data: ListParams): AxiosPromise => getFootballScheduleList<FootballScheduleItem>(data)

const { confirm } = Modal

const BasketballSchedule: FC = () => {
  const tableRef = useRef<ProTableHandles>(null)
  const formRef = useRef<ModalEditHandles>(null)
  const [selectList, setSelectList] = useState<SelectItem[]>()
  const [teamSelectList, setTeamSelectList] = useState<SelectItem[]>()

  // 获取球队数据
  const getTeamList = (data: string): void => {
    if (!data) {
      setTeamSelectList([])
      return
    }
    getFootballTeamList({ name: data }).then((res): void => {
      const { content = [] } = res.data
      const arr = content.map(
        ((item: FootballPlayerItem): SelectItem => (
          { name: item.name, key: item.id }
        ))
      )
      setTeamSelectList(arr)
    })
  }

  // 获取比赛信息
  const getMatchList = (data: string): void => {
    if (!data) {
      setSelectList([])
      return
    }
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

  const searchList: SearchItem[] = [
    {
      name: '所属赛事',
      type: 'select',
      key: 'matchId',
      selectList,
      onSearch: getMatchList
    },
    {
      name: '比赛阶段',
      type: 'input',
      key: 'name',
    },
    {
      name: '比赛状态',
      type: 'select',
      key: 'status',
      selectList: matchStatusSelectList,
    },
    {
      name: '赛队',
      type: 'select',
      key: 'teamId',
      selectList: teamSelectList,
      onSearch: getTeamList
    },
    {
      name: '比赛时间',
      type: 'rangePicker',
      key: 'createTime',
      rangeDateKey: {
        startTime: 'startTime',
        endTime: 'endTime'
      }
    },
  ]

  const createModal = (
    isAdd: boolean,
    data?: FootballScheduleItem,
    index?: number
  ): void => {
    confirm({
      title: `${isAdd ? '创建' : '编辑'}足球比赛`,
      width: '520px',
      centered: true,
      okText: '保存',
      cancelText: '取消',
      content: (
        <ConfigProvider locale={zhCN}>
          <ScheduleEdit ref={formRef} formData={data} />
        </ConfigProvider>
      ),
      onOk: () => new Promise((resolve, reject) => {
        if (!formRef.current) return
        formRef.current.submitForm().then((formRes) => {
          const params = {
            ...formRes,
            startTime: `${moment(formRes.startTime).format('YYYY-MM-DD HH:mm')}:00`,
            id: data?.id
          }
          updateFootballcheduleItem(params).then(() => {
            message.success(isAdd ? '添加成功' : '编辑成功')
            if (isAdd) {
              tableRef.current?.updata()
            } else {
              tableRef.current?.updataItem(params, index || 0)
            }
            resolve()
          }).catch(() => {
            reject()
          })
        }).catch(() => {
          reject()
        }).catch(() => {
          reject()
        })
      })
    })
  }

  const columns: ColumnsType<FootballScheduleItem> = [
    {
      title: '比赛阶段',
      width: 200,
      render(_, record): ReactElement {
        return (
          <NoneWrap showText={record.name} />
        )
      }
    },
    {
      title: '对阵',
      width: 230,
      render: (_, record): ReactElement => (
        <BattleTeams
          homeTeamName={record.homeTeamName}
          homeTeamLogo={record.homeTeamLogo}
          homeTeamScore={record.homeTeamScore}
          guestTeamName={record.guestTeamName}
          guestTeamLogo={record.guestTeamLogo}
          guestTeamScore={record.guestTeamScore}
        />
      )
    },
    {
      title: '比赛时间',
      render(_, record): ReactElement {
        const str = record.startTime
          ? moment(record.startTime).format('YYYY-MM-DD HH:mm')
          : undefined
        return (
          <NoneWrap showText={str} />
        )
      }
    },
    {
      title: '比赛状态',
      render: (_, record): ReactElement => (
        <div>
          <NoneWrap showText={MatchStatus[record.status]} />
        </div>
      )
    },
    {
      title: '原因',
      render(_, record): ReactElement {
        return (
          <NoneWrap showText={record.reason} />
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 160,
      render(_, record, index): ReactElement {
        return (
          <div>
            <Button
              size="small"
              style={{
                marginRight: '10px'
              }}
              type="primary"
              onClick={(): void => {
                createModal(false, record, index)
              }}
            >
              编辑
            </Button>
            <Button
              size="small"
              danger
              type="primary"
              onClick={(): void => {
                confirm({
                  title: '确定删除?',
                  icon: <ExclamationCircleOutlined />,
                  okType: 'primary',
                  okText: '是',
                  cancelText: '否',
                  onOk() {
                    deleteScheduleItem({
                      matchType: 'FOOTBALL',
                      id: record.id
                    }).then(() => {
                      message.success('删除成功')
                      if (!tableRef.current) return
                      tableRef.current.deleteItem(record.id)
                    })
                  }
                })
              }}
            >
              删除
            </Button>
          </div>
        )
      }
    }
  ]
  const headerBtnGroup = (
    <Button
      type="primary"
      onClick={(): void => {
        createModal(true)
      }}
    >
      创建比赛
    </Button>
  )
  return (
    <div>
      <ProTable
        ref={tableRef}
        api={api}
        headerBtnGroup={headerBtnGroup}
        tableProps={{
          columns,
        }}
        searchList={searchList}
        scrollX={1400}
      />
    </div>
  )
}

export default BasketballSchedule
