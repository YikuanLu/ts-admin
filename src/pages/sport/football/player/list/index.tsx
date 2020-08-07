import React, { FC, ReactElement, MutableRefObject, useRef } from 'react'

import { useHistory } from 'react-router-dom'
import { Button, Modal, message } from 'antd'
import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table/interface'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { SearchItem, ListParams } from '@/components/common/table/types'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'

import { getFootballPlayerList, deleteFootballPlayer } from '@/api/sport/football'

import NoneWrap from '@/components/common/noneContent'
import style from './style.module.sass'
import ShowLogoName from '@/components/sport/showLogoName'

const api = (data: ListParams): AxiosPromise => getFootballPlayerList(data)

const BasketballPlayer: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const history = useHistory()

  const searchList: SearchItem[] = [
    {
      name: '球员',
      type: 'input',
      key: 'name',
    },
    {
      name: '赛队',
      type: 'input',
      key: 'teamName',
    },
  ]

  const columns: ColumnsType = [
    {
      title: '球员名称',
      width: 180,
      render: (value): ReactElement => (
        <ShowLogoName
          logo={value.logo}
          name={value.shortName || value.englishShortName || value.name || value.originalName}
          englishName={value.name}
        />
      )
    },
    {
      title: '所属球队',
      render: (value): ReactElement => {
        const { teamLogo, teamName, teamShortName, teamEnglishName } = value
        return (
          <ShowLogoName
            logo={teamLogo}
            name={teamShortName || teamEnglishName || teamName}
            englishName={teamName}
          />
        )
      }
    },
    {
      title: '球衣号',
      align: 'center',
      dataIndex: 'jersey',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '位置',
      align: 'center',
      dataIndex: 'position',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '年龄（岁）',
      align: 'center',
      dataIndex: 'age',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '出生国家',
      align: 'center',
      dataIndex: 'country',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 200,
      render(value): ReactElement {
        return (
          <div>
            <Button
              size="small"
              style={{
                marginRight: '10px'
              }}
              type="primary"
              onClick={(): void => {
                history.push(`/football/player/edit?id=${value.id}`)
              }}
            >
              编辑
            </Button>
            <Button
              size="small"
              className={style.redBtn}
              danger
              type="primary"
              onClick={(): void => {
                Modal.confirm({
                  title: '确定删除?',
                  icon: <ExclamationCircleOutlined />,
                  okType: 'primary',
                  okText: '是',
                  cancelText: '否',
                  onOk() {
                    deleteFootballPlayer({
                      id: value.id,
                      teamType: 'FOOTBALL'
                    }).then(() => {
                      message.success('球员删除成功')
                      tableRef.current.deleteItem(value.id)
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
      style={{ marginBottom: '10px' }}
      type="primary"
      onClick={(): void => {
        history.push({ pathname: '/football/player/create' })
      }}
    >
      创建球员
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

export default BasketballPlayer
