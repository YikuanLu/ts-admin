import React, { FC, useRef, ReactElement } from 'react'
import { AxiosPromise } from 'axios'
import { Button, Modal, message, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { ColumnsType } from 'antd/lib/table'
import { StoreValue } from 'antd/lib/form/interface'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { SearchItem, ListParams } from '@/components/common/table/types'
import {
  getRecommendGame,
  patchRecommendGame,
  deleteRecommendGame,
  updateRecommendGame
} from '@/api/main/appOption'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import RecommendGameModal, { ModalEditHandles } from '@/components/main/appOption/recommendGame/editRecommendGame'
import NoneWrap from '@/components/common/noneContent'
import styles from './style.module.sass'
import { RecommendGameModel } from '../type'
import { SportTypes } from '@/config/data'
import BattleTeams from '@/components/sport/battleTeams'
import { formatDate } from '@/utils/commonFn'

const api = (data: ListParams): AxiosPromise => getRecommendGame<RecommendGameModel>(data)

const searchList: SearchItem[] = [
  {
    type: 'dayePicker',
    name: '日期',
    key: 'time',
  }
]

const { confirm } = Modal

const RecommendGameList: FC = () => {
  const tableRef = useRef<ProTableHandles>(null)
  const formRef = useRef<ModalEditHandles>(null)

  const createModal = (
    isAdd: boolean,
    record?: StoreValue,
    index?: number
  ): void => {
    confirm({
      title: `${isAdd ? '新增' : '编辑'}推荐赛事`,
      width: '40%',
      centered: true,
      okText: `${isAdd ? '创建' : '保存'}`,
      cancelText: '取消',
      onCancel: () => new Promise((resolve) => {
        resolve()
      }),
      onOk: () => new Promise((resolve, reject) => {
        if (!formRef.current) return
        formRef.current.submitForm().then((formRes) => {
          const params = {
            id: isAdd ? undefined : record.id,
            enable: isAdd ? false : record.enable,
            sort: formRes.sort,
            startTime: `${formatDate(formRes.time[0])} 00:00:00`,
            endTime: `${formatDate(formRes.time[1])} 23:59:59`,
            matchId: formRes.match[0].id,
            matchType: formRes.match[0].type
          }
          updateRecommendGame(params).then(() => {
            if (isAdd && tableRef.current) {
              tableRef.current.updata()
            } else {
              const curObj = {
                id: record.id,
                matchId: formRes.match[0].matchId,
                schedule: formRes.match[0],
                startTime: formatDate(formRes.time[0]),
                endTime: formatDate(formRes.time[1]),
                sort: formRes.sort,
                enable: record.enable,
              }
              if (index !== undefined && tableRef.current) {
                tableRef.current.updataItem({ ...curObj }, index)
              }
            }
            message.success(isAdd ? '添加成功' : '修改成功')
            resolve()
          }).catch(() => {
            reject()
          })
        }).catch(() => {
          reject()
        })
      }),
      content: (
        <ConfigProvider locale={zhCN}>
          <RecommendGameModal ref={formRef} formData={record} />
        </ConfigProvider>
      )
    })
  }

  const changeState = (data: RecommendGameModel, index: number): void => {
    const params = {
      id: data.id,
      enable: !data.enable
    }
    patchRecommendGame(params).then(() => {
      message.success('修改成功')
      if (!tableRef.current) return
      tableRef.current.updataItem({ enable: !data.enable }, index)
    })
  }
  const columns: ColumnsType<RecommendGameModel> = [
    {
      title: '项目',
      width: 60,
      align: 'center',
      render: (_, record): ReactElement => {
        const { schedule } = record
        if (!schedule) return <div>--</div>
        return (
          <div>
            <NoneWrap showText={SportTypes[schedule.type]} />
          </div>
        )
      },
    },
    {
      title: '比赛名称',
      align: 'center',
      render: (_, record): ReactElement => {
        const { schedule } = record
        if (!schedule) return <div>--</div>
        return (
          <div>
            <NoneWrap showText={schedule.name} />
          </div>
        )
      },
    },
    {
      title: '比赛时间',
      width: 200,
      align: 'center',
      render: (_, record): ReactElement => {
        const { schedule } = record
        if (!schedule) return <div>--</div>
        return (
          <div>
            <NoneWrap showText={schedule.startTime} />
          </div>
        )
      },
    },
    {
      title: '对阵',
      width: 220,
      align: 'center',
      render: (_, record): ReactElement => {
        const { schedule } = record
        if (!schedule) return <div>--</div>
        return (
          <BattleTeams
            homeTeamName={schedule.homeTeamName || '--'}
            homeTeamLogo={schedule.homeTeamLogo}
            guestTeamName={schedule.guestTeamName || '--'}
            guestTeamLogo={schedule.guestTeamLogo}
            homeTeamScore={schedule.homeTeamScore || 0}
            guestTeamScore={schedule.guestTeamScore || 0}
            isNBA={schedule.matchShortName === 'NBA'}
          />
        )
      }
    },
    {
      title: '比赛状态',
      width: 120,
      align: 'center',
      render: (_, record): ReactElement => {
        const { schedule } = record
        if (!schedule) return <div>--</div>
        return (
          <div
            className={schedule.progressStatus === 'PROGRESS' ? styles.matchEnable : ''}
          >
            <NoneWrap showText={schedule.statusName} />
          </div>
        )
      },
    },
    {
      title: '有效期',
      align: 'center',
      render: (_, record): ReactElement => (
        <div>
          {record.startTime.split(' ')[0]}
          至
          {record.endTime.split(' ')[0]}
        </div>
      ),
    },
    {
      title: '状态',
      width: 80,
      align: 'center',
      render: (_, record): ReactElement => (
        <div
          className={record.enable ? styles.matchEnable : styles.matchUnable}
        >
          {record.enable === true ? '启用' : '禁用'}
        </div>
      ),
    },
    {
      title: '排序',
      width: 80,
      align: 'center',
      render: (_, record): ReactElement => (
        <div>
          {record.sort === 0 ? '--' : record.sort}
        </div>
      ),
      sorter: true,
      key: 'sort',
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (_, record, index): ReactElement => (
        <>
          <div
            className={styles.btnGroup}
          >
            <Button
              type="primary"
              size="small"
              onClick={(): void => {
                createModal(false, record, index)
              }}
            >
              编辑
            </Button>
            <Button
              className={
                record.enable ? '' : styles.successBtn
              }
              type={record.enable ? 'primary' : undefined}
              danger={record.enable}
              size="small"
              onClick={(): void => {
                changeState(record, index)
              }}
            >
              {
                record.enable ? '禁用' : '启用'
              }
            </Button>
            <Button
              danger
              type="primary"
              size="small"
              onClick={(): void => {
                confirm({
                  title: '确定删除?',
                  icon: <ExclamationCircleOutlined />,
                  okType: 'primary',
                  okText: '是',
                  cancelText: '否',
                  onOk() {
                    deleteRecommendGame({
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
        </>
      )
    }
  ]
  const headerBtnGroup = (
    <Button
      type="primary"
      onClick={(): void => {
        createModal(true)
      }}
    >
      新增推荐赛事
    </Button>
  )
  return (
    <div>
      <ProTable
        headerBtnGroup={headerBtnGroup}
        ref={tableRef}
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

export default RecommendGameList
