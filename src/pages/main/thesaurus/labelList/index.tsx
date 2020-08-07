import React, { FC, useRef, MutableRefObject, useState, useEffect } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import moment from 'moment'
import { Button, Space, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import lodash from 'lodash'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { ListParams, SearchItem, SelectItem } from '@/components/common/table/types'
import { SectionItem, ConfirmProps, LabelItem } from '../types'

import style from './style.module.sass'
import { getLabelList, getArticleLabel, updatLabelEnabled, saveLabel, getLabelItem } from '@/api/main/thesaurus'
import NoneWrap from '@/components/common/noneContent'
import LabelListEditModal from '@/components/main/thesaurus/LabelListEditModal'

const { confirm } = Modal

const api = (data: ListParams): AxiosPromise => getLabelList(data)

const LabelList: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const [selectList, setSelectList] = useState<SelectItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [itemDetail, setItemDetail] = useState<LabelItem>({} as LabelItem)

  const searchSection = (name?: string): void => {
    getArticleLabel({ name }).then((res): void => {
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
  const enableAndDisable = (data: SectionItem, index: number): void => {
    const { enabled, id } = data
    showConfirm({
      title: '提示',
      content: '是否确认执行该操作',
      okFC: (): void => {
        updatLabelEnabled({ enabled: !enabled, id }).then((): void => {
          tableRef.current.updataItem({
            ...data,
            updateTime: moment().format('YYYY-MM-DD HH:mm'),
            enabled: !enabled
          }, index)
        })
      }
    })
  }

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    if (lodash.isEmpty(itemDetail)) {
      setShowModal(false)
    }
  }, [itemDetail])

  const saveData = (data: LabelItem): void => {
    const { id } = itemDetail
    saveLabel({ id, ...data }).then((res): void => {
      if (id) {
        tableRef.current.updataItem(res.data, currentIndex)
      } else {
        tableRef.current.updata()
      }
    })
    setItemDetail({} as LabelItem)
  }

  const searchList: SearchItem[] = [
    {
      name: '标签名称',
      type: 'input',
      key: 'name'
    },
    {
      name: '标签分类',
      type: 'select',
      key: 'groupId',
      selectList,
      onSearch: (data): void => {
        searchSection(data)
      }
    },
    {
      name: '标签状态',
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
    {
      name: '创建时间',
      type: 'rangePicker',
      key: 'createTime',
      rangeDateKey: {
        startTime: 'begin',
        endTime: 'end'
      }
    },
  ]
  const columns: ColumnsType = [
    {
      title: '标签名称',
      dataIndex: 'name',
      width: 50
    },
    {
      title: '标签分类',
      dataIndex: 'groupName',
      width: 50,
      render: (value: string): React.ReactElement => (<NoneWrap showText={value} />)
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 100,
      render: (value: string): React.ReactElement => (
        <NoneWrap className={style.tableArticleTitle} showText={value} />
      )
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
      title: '文章数',
      dataIndex: 'articleNum',
      width: 50,
      sorter: true,
      key: 'articleNum',
    },
    {
      title: '用户数',
      dataIndex: 'userNum',
      width: 60,
      sorter: true,
      key: 'userNum',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      width: 50,
      render: (value: string): React.ReactElement => (<NoneWrap showText={value} />)
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
        const itemData = record as SectionItem
        const { enabled, id } = itemData
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={(): void => {
                getLabelItem({ id }).then((res): void => {
                  const { data } = res
                  setItemDetail(data as LabelItem)
                  setCurrentIndex(index)
                  setShowModal(true)
                })
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
          </Space>
        )
      }
    },
  ]

  const headerBtnGroup = (
    <Button
      style={{ marginBottom: '10px' }}
      type="primary"
      onClick={(): void => {
        setShowModal(true)
      }}
    >
      创建标签
    </Button>
  )

  return (
    <div>
      <ProTable
        headerBtnGroup={headerBtnGroup}
        api={api}
        tableProps={{ columns }}
        scrollX={1700}
        ref={tableRef}
        searchList={searchList}
      />
      {showModal
        && (
          <LabelListEditModal
            visible={showModal}
            initData={itemDetail}
            updataList={(res): void => {
              saveData(res)
            }}
            cancelFn={(): void => {
              setShowModal(false)
              setItemDetail({} as LabelItem)
            }}
          />
        )}
    </div>
  )
}
export default LabelList
