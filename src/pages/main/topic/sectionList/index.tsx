import React, { FC, useState, useRef, MutableRefObject } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import { Button, Space, Modal, message } from 'antd'
import moment from 'moment'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { ListParams, SearchItem } from '@/components/common/table/types'
import { getSectionGroupList, saveSectionGroup, getSectionGroupDetail, updateSectionGroupDelete, updateSectionGroupEnabled } from '@/api/main/topic'
import NoneWrap from '@/components/common/noneContent'
import style from './style.module.sass'
import SectionModal from '@/components/main/topic/sectionModal'
import { EditSectionItem, SectionItem, ConfirmProps } from './types'

const { confirm } = Modal

const api = (data: ListParams): AxiosPromise => getSectionGroupList(data)
const searchList: SearchItem[] = [
  {
    name: '版块名称',
    type: 'input',
    key: 'name'
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
const SectionList: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const [sectionModalVisible, setSectionModalVisible] = useState(false)
  const [detailData, saveDetailData] = useState<EditSectionItem>()
  const [modifyIndex, saveModifyIndex] = useState<number>(-1)

  const saveItem = (data: EditSectionItem): void => {
    const obj = detailData || {}
    saveSectionGroup({ ...obj, ...data }).then((): void => {
      if (modifyIndex !== -1 && detailData && Object.keys(detailData).length > 0) {
        tableRef.current.updataItem({ ...obj, ...data }, modifyIndex)
      } else {
        tableRef.current.updata()
      }
      saveModifyIndex(-1)
      saveDetailData({} as EditSectionItem)
    })
  }

  const getDetail = (id: string): void => {
    getSectionGroupDetail({ id }).then((res): void => {
      const { data } = res
      saveDetailData(data as EditSectionItem)
      setSectionModalVisible(true)
    })
  }

  const showConfirm = (data: ConfirmProps): void => {
    const { title, content, okFC } = data
    confirm({
      title,
      icon: <ExclamationCircleOutlined />,
      content,
      onOk: okFC
    })
  }

  const deleteItem = (data: SectionItem): void => {
    const { topicNum, name, id } = data
    if (parseInt(topicNum, 10) === 0) {
      showConfirm({
        title: '提示',
        content: '是否确认执行该操作',
        okFC: (): void => {
          updateSectionGroupDelete({ id }).then((): void => {
            tableRef.current.deleteItem(id)
            message.success(`版块${name}删除成功`)
          })
        }
      })
    } else {
      message.error('该版块下还有话题,不能删除')
    }
  }

  const enableAndDisable = (data: SectionItem, index: number): void => {
    const { enabled, id } = data
    showConfirm({
      title: '提示',
      content: '是否确认执行该操作',
      okFC: (): void => {
        updateSectionGroupEnabled({ enabled: !enabled, id }).then((): void => {
          tableRef.current.updataItem({
            ...data,
            updateTime: moment().format('YYYY-MM-DD HH:mm'),
            enabled: !enabled
          }, index)
        })
      }
    })
  }

  const columns: ColumnsType = [
    {
      title: '版块名称',
      dataIndex: 'name',
      width: 120
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 80,
      render: (value: string): React.ReactElement => (
        <NoneWrap showText={value} className={style.tableEllipsis} title={value} />
      )
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      width: 40,
      render: (value: string): React.ReactElement => {
        const statusStyle = value ? style.open : style.close
        const showContent = value ? '· 启用' : '· 禁用'
        return <div className={statusStyle}>{showContent}</div>
      }
    },
    {
      title: '话题数',
      dataIndex: 'topicNum',
      align: 'center',
      sorter: true,
      key: 'topicNum',
      width: 40
    },
    {
      title: '浏览次数',
      dataIndex: 'clickUserNum',
      align: 'center',
      sorter: true,
      key: 'clickUserNum',
      width: 50
    },
    {
      title: '排序值',
      dataIndex: 'sort',
      align: 'center',
      sorter: true,
      key: 'sort',
      width: 40,
      render: (value: string): React.ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      width: 60,
      render: (value: string): React.ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      sorter: true,
      key: 'createTime',
      width: 80,
      render: (value: string): React.ReactElement => (
        <NoneWrap showText={value ? moment(value).format('YYYY-MM-DD HH:mm') : ''} />
      )
    },
    {
      title: '最后更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      sorter: true,
      key: 'updateTime',
      width: 80,
      render: (value: string): React.ReactElement => (
        <NoneWrap showText={value ? moment(value).format('YYYY-MM-DD HH:mm') : ''} />
      )
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
            <Button type="primary" size="small" onClick={(): void => { getDetail(id); saveModifyIndex(index) }}>编辑</Button>
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

  const headerBtnGroup = (
    <Button
      style={{ marginBottom: '10px' }}
      type="primary"
      onClick={(): void => {
        saveDetailData({} as EditSectionItem)
        setSectionModalVisible(true)
      }}
    >
      创建版块
    </Button>
  )
  return (
    <div>
      <ProTable
        ref={tableRef}
        headerBtnGroup={headerBtnGroup}
        api={api}
        tableProps={{
          columns
        }}
        searchList={searchList}
        scrollX={1900}
      />
      <SectionModal
        initData={detailData}
        visible={sectionModalVisible}
        cancelFn={(): void => { setSectionModalVisible(false) }}
        updataList={(value): void => {
          saveItem(value)
          setSectionModalVisible(false)
        }}
      />
    </div>
  )
}

export default SectionList
