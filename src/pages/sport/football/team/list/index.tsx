import React, {
  FC,
  ReactElement,
  MutableRefObject,
  useRef,
  useEffect,
  useState
} from 'react'

import { useHistory } from 'react-router-dom'
import { Button, Modal, message } from 'antd'
import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table/interface'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { SearchItem, ListParams, SelectItem } from '@/components/common/table/types'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'

import { getFootballTeamList, getFootballMatchList, deleteFootBallTeam } from '@/api/sport/football'

import style from './style.module.sass'
import ShowLogoName from '@/components/sport/showLogoName'
import { FootballMatchItem } from '../../types'

const api = (data: ListParams): AxiosPromise => getFootballTeamList(data)


const TeamList: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const history = useHistory()

  const [selectList, setSelectList] = useState<SelectItem[]>()

  useEffect(() => {
    getFootballMatchList({}).then((res) => {
      const { data: { content } } = res
      const arr = content.map(
        ((item: FootballMatchItem): SelectItem => (
          { name: item.shortName, key: item.id }
        ))
      )
      setSelectList(arr)
    })
  }, [])

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
  ]

  const columns: ColumnsType = [
    {
      title: '赛队名称',
      render: (value): ReactElement => (
        <ShowLogoName
          logo={value.logo}
          name={value.shortName}
          englishName={value.name}
        />
      )
    },
    {
      title: '所属赛事',
      render: (value): ReactElement => {
        const { matchName, matchShortName, matchLogo } = value
        return (
          <ShowLogoName
            englishName={matchName}
            name={matchShortName}
            logo={matchLogo}
          />
        )
      }
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
                history.push(`/football/team/edit?id=${value.id}`)
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
                    deleteFootBallTeam({
                      id: value.id,
                      teamType: 'FOOTBALL'
                    }).then(() => {
                      message.success('球队删除成功')
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
        history.push({ pathname: '/football/team/create' })
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

export default TeamList
