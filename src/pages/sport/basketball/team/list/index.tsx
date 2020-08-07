import React, {
  FC,
  ReactElement,
  MutableRefObject,
  useRef,
  // useEffect,
  useState
} from 'react'

import { useHistory } from 'react-router-dom'
import { Button, Modal, message } from 'antd'
import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table/interface'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { BasketballMatchItem, BasketballTeamItem } from '@/pages/sport/basketball/types'
import { SearchItem, ListParams, SelectItem } from '@/components/common/table/types'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'

import {
  getBasketballTeamList,
  getBasketballMatchList
} from '@/api/sport/basketball'

import ShowLogoName from '@/components/sport/showLogoName'
import { deleteTeamItem } from '@/api/sport/base'

const api = (data: ListParams): AxiosPromise => getBasketballTeamList(data)

const { confirm } = Modal

const BasketballMatch: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const history = useHistory()

  const [selectList, setSelectList] = useState<SelectItem[]>()

  // useEffect(() => {
  //   getBasketballMatchList({}).then((res) => {
  //     const { data: { content } } = res
  //     const arr = content.map(
  //       ((item: BasketballMatchItem): SelectItem => (
  //         { name: item.shortName, key: item.id }
  //       ))
  //     )
  //     setSelectList(arr)
  //   })
  // }, [])

  const searchList: SearchItem[] = [
    {
      name: '球队名称',
      type: 'input',
      key: 'name',
    },
    {
      name: '所属赛事',
      type: 'select',
      key: 'matchId',
      selectList,
      onSearch: (data): void => {
        getBasketballMatchList({ name: data }).then((res): void => {
          const { content = [] } = res.data
          const arr = content.map(
            ((item: BasketballMatchItem): SelectItem => (
              { name: item.shortName, key: item.id }
            ))
          )
          setSelectList(arr)
        })
      }
    },
  ]

  const columns: ColumnsType<BasketballTeamItem> = [
    {
      title: '赛队',
      render: (_, record): ReactElement => (
        <ShowLogoName
          logo={record.logo}
          name={record.shortName}
          englishName={record.name}
        />
      )
    },
    {
      title: '所属赛事',
      render: (_, record): ReactElement => {
        const { matchName, matchShortName, matchLogo } = record
        return (
          <ShowLogoName
            logo={matchLogo}
            name={matchShortName}
            englishName={matchName}
          />
        )
      }
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
                history.push(`/basketball/team/${record.id}`)
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
                    deleteTeamItem({
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
        history.push('/basketball/team/add')
      }}
    >
      创建赛队
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
        scrollX={1200}
      />
    </div>
  )
}

export default BasketballMatch
