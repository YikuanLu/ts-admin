import React, { FC, useState, useEffect, ReactElement } from 'react'
import { Table, Button, Modal, Form, Select, Input, message } from 'antd'
import { useLocation, useParams } from 'react-router-dom'
import { ColumnsType } from 'antd/lib/table'
import { getParamObj } from '@/utils/commonFn'
import { getReportHandleInfo, updateReportStatus } from '@/api/main/report'
import { solveStatus, SolveStatus, AcceptanceResultType } from '../reportList/reportType'
import NoneWrap from '@/components/common/noneContent'

import style from './style.module.sass'
import { acceptanceResultEnum } from '@/pages/main/option/report/detail'


const { Option } = Select
const { TextArea } = Input

interface ReportHistoryListProps {
  listLength?: (data: number) => void,
}

interface ReportHistoryItem {
  acceptanceResult: AcceptanceResultType;
  assignee: null;
  assigneeId: string;
  businessId: string;
  businessType: string;
  createTime: string;
  description: string;
  number: string;
  solveTime: string;
  status: solveStatus;
}

const formItemLayout = {
  labelCol: {
    lg: { span: 4 },
    md: { span: 24 }
  },
  wrapperCol: {
    lg: { span: 20 },
    md: { span: 24 }
  }
}

const ReportHistoryList: FC<ReportHistoryListProps> = (props: ReportHistoryListProps) => {
  const { listLength } = props
  const { type } = useParams()
  const { search } = useLocation()
  const { businessId } = getParamObj(search)
  const [form] = Form.useForm()
  const [listData, saveListData] = useState<{
    count: number,
    list: ReportHistoryItem[]
  }>({
    count: 0,
    list: [],
  })

  const formEle = (): React.ReactElement => (
    <Form form={form}>
      <Form.Item
        {...formItemLayout}
        label="受理结果"
        name="acceptanceResult"
        rules={[{ required: true, message: '请选择受理结果' }]}
      >
        <Select placeholder="请选择受理结果">
          {
            acceptanceResultEnum
              .filter((items) => items.type === type)
              .map((item: { name: string, key: string }) => (
                <Option key={item.key} value={item.key}>{item.name}</Option>
              ))
          }
        </Select>
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="备注"
        name="description"
      >
        <TextArea placeholder="请输入200字以内的备注" maxLength={200} />
      </Form.Item>
    </Form>
  )

  const getList = (page: number, pageSize: number): void => {
    getReportHandleInfo({
      businessId,
      businessType: type.toUpperCase(),
      size: pageSize,
      page
    }).then((res) => {
      const { content, count } = res.data
      saveListData({ ...listData, list: content, count })
    })
  }
  const columns: ColumnsType<object> = [
    {
      title: '受理单号',
      dataIndex: 'number',
      width: 200,
    },
    {
      title: '建单时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '被举报次数',
      dataIndex: 'clickNum',
      width: 120,
    },
    {
      title: '举报用户数',
      dataIndex: 'userNum',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (data: solveStatus): ReactElement => (
        <NoneWrap
          className={style[data]}
          showText={SolveStatus[data]}
        />
      )
    },
    {
      title: '受理人',
      dataIndex: 'assignee',
      width: 100,
      render: (data: string): ReactElement => (
        <NoneWrap
          showText={data}
        />
      )
    },
    {
      title: '受理时间',
      dataIndex: 'solveTime',
      width: 200,
      render: (data: string): ReactElement => (
        <NoneWrap
          showText={data}
        />
      )
    },
    {
      title: '受理结果',
      dataIndex: 'acceptanceResult',
      width: 150,
      render: (data: AcceptanceResultType): ReactElement => {
        const { message: textMessage } = data ? acceptanceResultEnum
          .filter((item) => item.type === type && item.key === data)[0]
          : { message: '' }
        return (
          <NoneWrap
            showText={textMessage}
          />
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'description',
      width: 400,
      render: (data: string): ReactElement => (
        <NoneWrap
          showText={data}
        />
      )
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (data): ReactElement => {
        const { status, id } = data
        return (
          <Button
            disabled={status === 'SOLVE'}
            type="primary"
            size="small"
            onClick={(): void => {
              Modal.confirm({
                icon: null,
                width: '700px',
                okText: '受理',
                title: {
                  information: '文章举报受理',
                  user: '用户举报受理',
                  comment: '回复举报受理',
                }[type],
                centered: true,
                content: (
                  formEle()
                ),
                onOk: async () => {
                  const datas = await form.validateFields()
                  const { acceptanceResult } = datas
                  updateReportStatus({ ...datas, id }).then(() => {
                    const { toast } = acceptanceResultEnum
                      .filter((item) => item.type === type && item.key === acceptanceResult)[0]
                    message.success(toast)
                    getList(0, 30)
                  }).catch(() => {
                    getList(0, 30)
                  })
                }
              })
            }}
          >
            {SolveStatus[status]}
          </Button>
        )
      }
    }
  ]


  useEffect(() => {
    getList(0, 30)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect((): void => {
    if (listLength) {
      listLength(listData.count)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData])
  return (
    <Table
      columns={columns}
      rowKey="businessId"
      dataSource={listData.list}
      pagination={
        {
          pageSizeOptions: ['10', '30'],
          defaultPageSize: 30,
          total: listData.count
        }
      }
      onChange={(data): void => {
        const { current = 1, pageSize = 30 } = data
        getList(current - 1, pageSize)
      }}
      scroll={{ x: 1680 }}
    />
  )
}

export default ReportHistoryList
