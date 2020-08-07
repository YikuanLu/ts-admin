import React, { useRef, MutableRefObject, ReactElement, useState } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import {
  Button,
  //  Modal,
  // message
} from 'antd'
// import { ExclamationCircleOutlined } from '@ant-design/icons'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { ListRes, SearchItem } from '@/components/common/table/types'
import {
  getSportsList,
  // changeSportStatus
} from '@/api/sport/base'
import ModifyModal from '@/components/sport/baseInfo/modify'

import style from './style.module.sass'
import NoneWrap from '@/components/common/noneContent'
import { SportItem, ModalProps } from '@/pages/sport/baseInfo/type'

// const { confirm } = Modal


const searchList: SearchItem[] = [
  {
    name: '项目名称',
    type: 'input',
    key: 'name'
  },
  {
    name: '创建时间',
    type: 'rangePicker',
    key: 'createTime',
    rangeDateKey: {
      startTime: 'startTime',
      endTime: 'endTime'
    }
  },
]

const api = (data: ListRes): AxiosPromise => getSportsList<ListRes>(data)


const SportsList: React.FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const defaultModalProps: ModalProps = {
    visible: false,
    itemData: {},
    cancelFn: () => { },
    updataList: () => { },
  }
  const [modifyProps, setModifyProps] = useState(defaultModalProps)

  // const showConfirm = (data: SportItem, index: number): void => {
  //   const { id } = data
  //   confirm({
  //     title: '警告',
  //     icon: <ExclamationCircleOutlined />,
  //     content: '是否确认执行该操作',
  //     okText: '确定',
  //     cancelText: '取消',
  //     onOk() {
  //       changeSportStatus({ id }).then((res): void => {
  //         tableRef.current.updataItem({ forbidden: res.data }, index)
  //         message.success('修改成功')
  //       })
  //     },
  //   })
  // }

  const columns: ColumnsType = [
    // {
    //   title: 'ID',
    //   width: 130,
    //   dataIndex: 'id',
    // },
    {
      title: '体育项目',
      width: 200,
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '描述',
      width: 200,
      dataIndex: 'description',
      render: (value: string): ReactElement => (
        <NoneWrap
          title={value}
          showText={value}
          className={style.tableArticleTitle}
        />
      )
    },
    // {
    //   title: '状态',
    //   width: 80,
    //   align: 'center',
    //   dataIndex: 'forbidden',
    //   render: (value: boolean): ReactElement => (
    //     <NoneWrap className={value ?
    //   style.close : style.open
    // } showText={value ? '· 禁用' : '· 启用'} />
    //   )
    // },
    {
      title: '文章数',
      width: 100,
      align: 'center',
      dataIndex: 'articleNum',
      key: 'articleNum',
      sorter: true
    },
    // {
    //   title: '话题数',
    //   width: 100,
    //   align: 'center',
    //   dataIndex: 'subjectNum',
    //   key: 'subjectNum',
    //   sorter: true
    // },
    {
      title: '资讯热度',
      width: 100,
      align: 'center',
      dataIndex: 'informationHot',
      key: 'informationHot',
      sorter: true
    },
    {
      title: '资讯人气',
      width: 100,
      align: 'center',
      dataIndex: 'informationPopularity',
      key: 'informationPopularity',
      sorter: true
    },
    {
      title: '赛事热度',
      width: 100,
      align: 'center',
      dataIndex: 'matchHot',
      key: 'matchHot',
      sorter: true
    },
    {
      title: '赛事人气',
      width: 100,
      align: 'center',
      dataIndex: 'matchPopularity',
      key: 'matchPopularity',
      sorter: true
    },
    // {
    //   title: '排序',
    //   width: 100,
    //   align: 'center',
    //   dataIndex: 'orderNum',
    //   key: 'orderNum',
    //   sorter: true,
    //   render: (value: string): ReactElement => (
    //     <NoneWrap showText={value} />
    //   )
    // },
    {
      title: '创建人',
      width: 200,
      align: 'center',
      dataIndex: 'createName',
      render: (value: string): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '创建时间',
      width: 200,
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '最后更新时间',
      width: 200,
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (_, record, index): ReactElement => {
        const itemData = record as SportItem
        // const { forbidden } = itemData
        return (
          <div>
            <Button
              size="small"
              type="primary"
              style={{ margin: '0 6px 6px 0' }}
              onClick={(): void => {
                setModifyProps({
                  visible: true,
                  itemData,
                  cancelFn: (): void => {
                    setModifyProps(defaultModalProps)
                  },
                  updataList: (val): void => {
                    const list = tableRef.current.getList<{}>()
                    tableRef.current.updataItem({ ...list[index], ...val }, index)
                    setModifyProps(defaultModalProps)
                  }
                })
              }}
            >
              编辑
            </Button>
          </div>
        )
      }
    },
  ]

  const headerBtnGroup = (
    <Button
      style={{ marginBottom: '10px' }}
      type="primary"
      onClick={(): void => {
        setModifyProps({
          visible: true,
          itemData: {},
          cancelFn: (): void => {
            setModifyProps(defaultModalProps)
          },
          updataList: (): void => {
            setModifyProps(defaultModalProps)
            tableRef.current.updata()
          }
        })
      }}
    >
      创建体育项目
    </Button>
  )

  return (
    <div>
      <ProTable
        ref={tableRef}
        headerBtnGroup={headerBtnGroup}
        api={api}
        scrollX={2700}
        tableProps={{
          columns,
        }}
        searchList={searchList}
      />
      {
        modifyProps.visible && (<ModifyModal {...modifyProps} />
        )
      }
    </div>
  )
}

export default SportsList
