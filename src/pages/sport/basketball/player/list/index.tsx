import React, {
  FC, ReactElement, MutableRefObject, useRef,
  // useState
} from 'react'

import { useHistory } from 'react-router-dom'
import { Button, Modal, message } from 'antd'
import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table/interface'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  // BasketballTeamItem,
  BasketballPlayerItem
} from '@/pages/sport/basketball/types'
import {
  SearchItem, ListParams,
  // SelectItem
} from '@/components/common/table/types'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'

import {
  getBasketballPlayerList,
  // getBasketballTeamList,
} from '@/api/sport/basketball'

import NoneWrap from '@/components/common/noneContent'
import { deletePlayerItem } from '@/api/sport/base'
import ShowLogoName from '@/components/sport/showLogoName'

const api = (data: ListParams): AxiosPromise => getBasketballPlayerList(data)

const { confirm } = Modal

const BasketballPlayer: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const history = useHistory()

  // const [selectList, setSelectList] = useState<SelectItem[]>()

  const searchList: SearchItem[] = [
    {
      name: '球员',
      type: 'input',
      key: 'name',
    },
    {
      name: '所属球队',
      type: 'input',
      key: 'teamName',
    },
  ]

  const columns: ColumnsType<BasketballPlayerItem> = [
    {
      title: '球员名称',
      width: 180,
      render: (_, record): ReactElement => (
        <ShowLogoName
          logo={record.logo}
          name={record.shortName}
          englishName={record.name}
        />
      )
    },
    {
      title: '国籍',
      align: 'center',
      dataIndex: 'jersey',
      render: (_, record): ReactElement => (
        <NoneWrap showText={record.country} />
      )
    },
    {
      title: '年龄',
      align: 'center',
      dataIndex: 'age',
      render: (_, record): ReactElement => (
        <NoneWrap showText={record.age} />
      )
    },
    {
      title: '所属球队',
      render: (_, record): ReactElement => {
        const { teamName, teamShortName, teamLogo } = record
        return (
          <ShowLogoName
            logo={teamLogo}
            name={teamShortName}
            englishName={teamName}
          />
        )
      }
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
      title: '球衣号',
      align: 'center',
      dataIndex: 'jersey',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '身高m/体重kg',
      align: 'center',
      render: (value): ReactElement => {
        const height = value.height !== null ? `${value.height}m` : '--'
        const str = `${height} / ${value.weight || '--'}`
        return (
          <NoneWrap showText={str} />
        )
      }
    },
    {
      title: '联盟球龄',
      align: 'center',
      dataIndex: 'ballAge',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '年薪',
      align: 'center',
      dataIndex: 'yearSalary',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 160,
      render(_, record): ReactElement {
        return (
          <div>
            <Button
              size="small"
              style={{
                marginRight: '10px'
              }}
              type="primary"
              onClick={(): void => {
                history.push(`/basketball/player/${record.id}`)
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
                    deletePlayerItem({
                      teamType: 'BASKETBALL',
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
        history.push('/basketball/player/add')
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
        scrollX={2000}
      />
    </div>
  )
}

export default BasketballPlayer
