import React, {
  FC,
  useRef,
  MutableRefObject,
  ReactElement,
  useState,
} from 'react'
import { connect } from 'react-redux'
import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import {
  getReportList,
} from '@/api/main/report'

import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { ListRes, SearchItem, ListParams } from '@/components/common/table/types'
import { SearchModal } from '@/models/search'

import style from './style.module.sass'
import { ReportDetail } from '../type'
import { StatusEnum, ReportResultEnum } from '../reportType'

import NoneWrap from '@/components/common/noneContent'

const api = (data: ListParams): AxiosPromise => getReportList<ListRes>(data)

const searchList: SearchItem[] = [
  {
    name: '状态',
    type: 'select',
    key: 'status',
    selectList: [
      {
        name: '已受理',
        key: 'SOLVE'
      },
      {
        name: '待受理',
        key: 'UNSOLVED'
      }
    ]
  }
]

// 三个表头共用的
const commonColumns: ColumnsType<ReportDetail> = [
  {
    title: '被举报次数',
    align: 'center',
    render: (_, record): ReactElement => (
      <div>
        {record.clickNum || 0}
      </div>
    ),
    key: 'clickNum',
    sorter: true
  },
  {
    title: '举报用户数',
    align: 'center',
    render: (_, record): ReactElement => (
      <div>
        {record.userNum || 0}
      </div>
    ),
    key: 'userNum',
    sorter: true
  },
  {
    title: '最近建单时间',
    render: (_, record): ReactElement => (
      <div>
        {record.createTime || 0}
      </div>
    )
  },
  {
    title: '状态',
    align: 'center',
    render: (_, record): ReactElement => {
      const str = StatusEnum[record.status]
      const strStyle = record.status === 'SOLVE' ? style.greenText : style.failColor
      return (
        <div className={strStyle}>
          <NoneWrap showText={str} />
        </div>
      )
    },
  },
  {
    title: '受理人',
    align: 'center',
    render: (_, record): ReactElement => (
      <div>
        <NoneWrap showText={record.assignee} />
      </div>
    ),
  },
  {
    title: '受理时间',
    align: 'center',
    render: (_, record): ReactElement => (
      <div>
        <NoneWrap showText={record.solveTime} />
      </div>
    ),
  },
  {
    title: '受理结果',
    align: 'center',
    render: (_, record): ReactElement => (
      <div>
        <NoneWrap showText={ReportResultEnum[record.acceptanceResult]} />
      </div>
    ),
  }
]
// 文章举报表头
const ArticleColumns: ColumnsType<ReportDetail> = [
  {
    title: '文章标题',
    width: 240,
    render: (_, record): ReactElement => (
      <div title={record.title} className={style.overFlowText}>
        <Link
          target="_blank"
          to={`article/edit?id=${record.businessId}`}
        >
          {record.title}
        </Link>
      </div>
    ),
  },
  ...commonColumns,
  {
    title: '可用操作',
    align: 'center',
    fixed: 'right',
    render: (_, record): ReactElement => (
      <Link
        to={`report/information?id=${record.id}&businessId=${record.businessId}`}
      >
        <Button
          type="primary"
          size="small"
        >
          详情
        </Button>
      </Link>
    )
  }
]
// 回复举报表头
const ReplyColumns: ColumnsType<ReportDetail> = [
  {
    title: '回复信息',
    width: 240,
    render: (_, record): ReactElement => (
      <div title={record.title} className={style.overFlowText}>
        <Link
          target="_blank"
          to={`comment?id=${record.businessId}`}
        >
          {record.title}
        </Link>
      </div>
    ),
  },
  ...commonColumns,
  {
    title: '可用操作',
    align: 'center',
    fixed: 'right',
    render: (_, record): ReactElement => (
      <Link
        to={`report/comment?id=${record.id}&businessId=${record.businessId}`}
      >
        <Button
          type="primary"
          size="small"
        >
          详情
        </Button>
      </Link>
    )
  }
]
// 用户举报表头
const UserColumns: ColumnsType<ReportDetail> = [
  {
    title: '被举报用户',
    width: 240,
    render: (_, record): ReactElement => (
      <div title={record.title} className={style.overFlowText}>
        <Link
          target="_blank"
          to={`userInfo/edit?id=${record.businessId}`}
        >
          {`[${record.uuid}] ${record.title}`}
        </Link>
      </div>
    ),
  },
  ...commonColumns,
  {
    title: '可用操作',
    align: 'center',
    fixed: 'right',
    render: (_, record): ReactElement => (
      <Link
        to={`report/user?id=${record.id}&businessId=${record.businessId}`}
      >
        <Button
          type="primary"
          size="small"
        >
          详情
        </Button>
      </Link>
    )
  }
]

const ReportList: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const [columns, setcolumns] = useState<ColumnsType<ReportDetail>>(ArticleColumns)


  const tabData = {
    key: 'type',
    list: [
      {
        name: '文章举报',
        key: 'INFORMATION'
      },
      {
        name: '回复举报',
        key: 'COMMENT'
      },
      {
        name: '用户举报',
        key: 'USER'
      },
    ]
  }

  return (
    <div>
      <ProTable
        ref={tableRef}
        tabData={tabData}
        searchList={searchList}
        tabValueChange={(val): void => {
          switch (val) {
            case 'INFORMATION':
              setcolumns(ArticleColumns)
              break
            case 'COMMENT':
              setcolumns(ReplyColumns)
              break
            case 'USER':
              setcolumns(UserColumns)
              break
            default:
              setcolumns(ArticleColumns)
              break
          }
        }}
        api={api}
        tableProps={{
          columns,
        }}
        scrollX={1800}
      />
    </div>
  )
}

const mapStateToProps = (
  state: { searchReducer: SearchModal }
): SearchModal => state.searchReducer

export default connect(
  mapStateToProps
)(ReportList)
