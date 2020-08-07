import React, { FC, useRef, MutableRefObject, useState, useEffect } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import moment from 'moment'
import { Button, Space, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { ListParams, SearchItem, SelectItem } from '@/components/common/table/types'
import { getTopicList, getSectionGroupList, updateTopicDelete, updateTopicEnabled } from '@/api/main/topic'
import { TopicItem } from '../types'
import SectionInfo from '@/components/main/topic/SectionInfo'

import style from '../style.module.sass'
import { SectionItem, ConfirmProps } from '../../sectionList/types'
import NoneWrap from '@/components/common/noneContent'

const { confirm } = Modal

const api = (data: ListParams): AxiosPromise => getTopicList(data)


const TopicList: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const history = useHistory()
  const [selectList, setSelectList] = useState<SelectItem[]>([])

  const searchSection = (data?: ListParams): void => {
    const params = {
      ...data,
      page: 0,
      size: 500
    } as ListParams
    getSectionGroupList(params).then((res): void => {
      const { content = [] } = res.data
      const arr = content.map(
        ((item: SectionItem): SelectItem => (
          { name: item.name, key: item.id }
        ))
      )
      setSelectList(arr)
    })
  }
  useEffect((): void => {
    searchSection()
  }, [])
  const showConfirm = (data: ConfirmProps): void => {
    const { title, content, okFC } = data
    confirm({
      title,
      icon: <ExclamationCircleOutlined />,
      content,
      onOk: okFC
    })
  }
  const enableAndDisable = (data: TopicItem, index: number): void => {
    const { enabled, id } = data
    showConfirm({
      title: '提示',
      content: '是否确认执行该操作',
      okFC: (): void => {
        updateTopicEnabled({ enabled: !enabled, id }).then((): void => {
          tableRef.current.updataItem({
            ...data,
            updateTime: moment().format('YYYY-MM-DD HH:mm'),
            enabled: !enabled
          }, index)
        })
      }
    })
  }
  const deleteItem = (data: TopicItem): void => {
    const { followUserNum, articleNum, name, id } = data
    if (followUserNum === 0 && articleNum === 0) {
      showConfirm({
        title: '提示',
        content: '是否确认执行该操作',
        okFC: (): void => {
          updateTopicDelete({ id }).then((): void => {
            tableRef.current.deleteItem(id)
            message.success(`话题${name}删除成功`)
          })
        }
      })
    } else {
      updateTopicDelete({ id }).then((): void => {
        tableRef.current.deleteItem(id)
        message.success(`话题${name}删除成功`)
      })
    }
  }
  const searchList: SearchItem[] = [
    {
      name: '话题名称',
      type: 'input',
      key: 'name'
    },
    {
      name: '所属版块',
      type: 'select',
      key: 'groupId',
      selectList,
      onSearch: (val): void => {
        searchSection({ name: val })
      }
    },
    {
      name: '状态',
      type: 'select',
      key: 'enabled',
      selectList: [{
        name: '启用',
        key: 'true',
      }, {
        name: '禁用',
        key: 'false',
      }]
    },
  ]
  const columns: ColumnsType = [
    {
      title: '话题名称',
      width: 130,
      render: (value: TopicItem): React.ReactElement => {
        const { icon, name } = value
        return (
          <SectionInfo icon={icon} name={name} />
        )
      }
    },
    {
      title: '所属版块',
      dataIndex: 'groupName',
      width: 50
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 50,
      render: (value: boolean): React.ReactElement => {
        const statusStyle = value ? style.open : style.close
        const showContent = value ? '· 启用' : '· 禁用'
        return <div className={statusStyle}>{showContent}</div>
      }
    },
    {
      title: '浏览次数',
      dataIndex: 'clickUserNum',
      width: 50,
      sorter: true,
      key: 'clickUserNum',
    },
    {
      title: '关注用户数',
      dataIndex: 'followUserNum',
      width: 60,
      sorter: true,
      key: 'followUserNum',
    },
    {
      title: '文章数',
      dataIndex: 'articleNum',
      width: 50,
      sorter: true,
      key: 'articleNum',
    },
    {
      title: '排序值',
      dataIndex: 'sort',
      width: 50,
      sorter: true,
      key: 'sort',
      render: (value: string): React.ReactElement =>
        <NoneWrap showText={value} />
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: 50
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 70,
      sorter: true,
      key: 'createTime',
      render: (value): React.ReactElement =>
        <div>{moment(value).format('YYYY-MM-DD HH:mm')}</div>
    },
    {
      title: '最后更新时间',
      dataIndex: 'updateTime',
      width: 70,
      sorter: true,
      key: 'updateTime',
      render: (value): React.ReactElement =>
        <div>{moment(value).format('YYYY-MM-DD HH:mm')}</div>
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, record, index): React.ReactElement => {
        const itemData = record as TopicItem
        const { enabled, id } = itemData
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={(): void => {
                history.push({ pathname: '/topic/edit', search: `?id=${id}` })
              }}
            >
              编辑

            </Button>
            {enabled && (
              <Button
                type="primary"
                danger
                size="small"
                onClick={(): void => {
                  enableAndDisable(itemData, index)
                }}
              >
                禁用
              </Button>
            )}
            {!enabled && (
              <Button
                className={style.greenBtn}
                size="small"
                onClick={(): void => {
                  enableAndDisable(itemData, index)
                }}
              >
                启用
              </Button>
            )}
            {!enabled && (
              <Button
                type="primary"
                danger
                size="small"
                onClick={(): void => {
                  deleteItem(itemData)
                }}
              >
                删除

              </Button>
            )}
          </Space>
        )
      }
    },
  ]

  // const getItemDetail = (id: string): void => {
  //   getTopicDetail({ id }).then((res): void => {
  //     console.log(res)
  //   })
  // }

  const headerBtnGroup = (
    <Button
      style={{ marginBottom: '10px' }}
      type="primary"
      onClick={(): void => {
        history.push({ pathname: '/topic/create' })
      }}
    >
      创建话题
    </Button>
  )

  return (
    <div>
      <ProTable
        api={api}
        headerBtnGroup={headerBtnGroup}
        tableProps={{ columns }}
        scrollX={2000}
        ref={tableRef}
        searchList={searchList}
      />
    </div>
  )
}
export default TopicList
