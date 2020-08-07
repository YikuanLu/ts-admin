import React, { FC, ReactElement, useState, useRef, MutableRefObject } from 'react'
import { Button, message } from 'antd'
import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table/interface'
import { useLocation } from 'react-router-dom'
import { ModalProps, ReplyModalProps, SortTypes, ReplyType } from '@/pages/main/comment/types'

import { SearchItem, ListRes } from '@/components/common/table/types'
import { getCommentlList } from '@/api/main'
import { commentStatus, ShieldReason, SortTypeStr } from '@/pages/main/comment/statusType'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import SortModal from '@/components/main/comment/SortModal'
import ShieldModal from '@/components/main/comment/ShieldModal'
import ReplyModal from '@/components/main/comment/ReplyModal'
import { getParamObj } from '@/utils/commonFn'

const searchList: SearchItem[] = [
  {
    name: '回复ID',
    type: 'number',
    key: 'id',
  },
  {
    name: '文章ID',
    type: 'input',
    key: 'articleId',
  },
  {
    name: '文章标题',
    type: 'input',
    key: 'articleTitle',
  },
  {
    name: '回复状态',
    type: 'select',
    key: 'status',
    selectList: commentStatus
  },
  {
    name: '回复时间',
    type: 'rangePicker',
    key: 'downloadTime',
    rangeDateKey: {
      startTime: 'startTime',
      endTime: 'endTime'
    }
  },
]

const api = (data: ListRes): AxiosPromise => getCommentlList(data)

const content = (data: string[], type: 'pic' | 'video'): string | '' => {
  if (data.length === 0) return ''
  let str = ''
  data.map((item) => {
    str += `[${type === 'pic' ? '图片' : '视频'}]`
    return item
  })
  return str
}

// 默认弹窗属性
const defaultModalProps: ModalProps = {
  visible: false,
  itemData: {},
  cancelFn: () => { },
  updataList: () => { },
}

// 默认回复弹窗属性
const defaultReplyModalProps: ReplyModalProps = {
  type: '',
  visible: false,
  itemData: {},
  cancelFn: () => { },
  updataList: () => { },
}

const CommentList: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  // const [page, setPage] = useState(0)
  const location = useLocation()
  // 排序弹窗
  const [sortModalProps, setSortModalProps] = useState(defaultModalProps)
  // 屏蔽弹窗
  const [shieldModal, setshieldModal] = useState(defaultModalProps)
  // 回复弹窗
  const [replyModalProps, setreplyModalProps] = useState<ReplyModalProps>(defaultReplyModalProps)

  // 回复弹窗属性
  const toReply = (type: ReplyType, value: object): void => {
    setreplyModalProps({
      visible: true,
      itemData: value,
      type,
      cancelFn: (): void => {
        setreplyModalProps(defaultReplyModalProps)
      },
      updataList: () => {
        message.success('添加成功')
        tableRef.current.updata(true)
      }
    })
  }

  const columns: ColumnsType = [
    {
      title: '回复ID',
      dataIndex: 'id',
      width: 200
    },
    {
      title: '回复内容',
      width: 200,
      render: (value): ReactElement => {
        let str = ''
        if (
          !value.content && value.pics.length > 0 && value.videos.length === 0
        ) {
          str = '图片信息'
        }
        if (!value.content && value.videos.length > 0 && value.pics.length === 0) {
          str = '视频信息'
        } else {
          str = `
          ${value.content || '--'}
          ${content(value.pics, 'pic')}
          ${content(value.videos, 'video')}
          `
        }
        return (
          <div
            className="overFlowText hoverStyle"
            title={str}
            onClick={(): void => {
              toReply('COMMENT', value)
            }}
          >
            {str}
          </div>
        )
      }
    },
    {
      title: '引用内容',
      width: 200,
      render: (value): ReactElement => {
        const str = `
        [${value.parentId}]
        @${value.reUserNickName ? value.reUserNickName : '--'}:
        ${value.reContent ? value.reContent : '--'}
        ${content(value.rePics, 'pic')}
        ${content(value.reVideos, 'video')}
        `
        return (
          <div
            className="overFlowText hoverStyle"
            title={str}
            onClick={(): void => {
              if (value.parentId === '0') return
              toReply('QUOTE', value)
            }}
          >
            {
              value.parentId === '0' ? '--' : str
            }
          </div>
        )
      }
    },
    {
      title: '所属文章',
      width: 200,
      render: (value): ReactElement => (
        <div
          className="overFlowText hoverStyle"
          title={value.articleStr}
          onClick={(): void => {
            toReply('ARTICLE', value)
          }}
        >
          {value.articleStr}
        </div>
      )
    },
    {
      title: '创建者',
      width: 200,
      render: (value): ReactElement => {
        const str = `
          [${value.userId}]
          ${value.nickName}
        `
        return (
          <div className="overFlowText" title={value.str}>
            {str}
          </div>
        )
      }
    },
    {
      title: '回复时间',
      align: 'center',
      width: 200,
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true
    },
    {
      title: '回复数',
      align: 'center',
      width: 200,
      dataIndex: 'reCommentNum',
      key: 'reCommentNum',
      sorter: true
    },
    {
      title: '点亮数',
      align: 'center',
      width: 110,
      render: (value): ReactElement => (
        <div>
          {value.giveNum || 0}
        </div>
      ),
      key: 'giveNum',
      sorter: true
    },
    {
      title: '排序值',
      align: 'center',
      width: 110,
      render: (value): ReactElement => {
        enum OrderStyle {
          'TOP' = 'failColor',
          'RECOMMEND' = 'primaryColor',
          'COMMON' = ''
        }
        const text = value.orderStr === '0' ? '--' : value.orderStr
        return (
          <div className={OrderStyle[value.orderType as SortTypes]}>
            {text}
          </div>
        )
      },
      key: 'orderStr',
      sorter: true
    },
    {
      title: '回复状态',
      align: 'center',
      width: 140,
      render: (value): ReactElement => {
        const styleMap = {
          1: '',
          2: 'successColor',
          '-1': 'failColor'
        }
        return (
          <div className={styleMap[value.status as (1 | 2 | '-1')]}>
            {value.statusStr}
          </div>
        )
      }
    },
    {
      title: '屏蔽原因',
      align: 'center',
      width: 140,
      render: (value): ReactElement => (
        <div>{ShieldReason[value.closeRemark as 'REPORT' | 'TACTFUL' | 'DELETE'] || '--'}</div>
      )
    },
    {
      title: '操作',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: (value, record, index): ReactElement => {
        const obj = {
          value, record, index
        }
        const { status } = obj.value
        return (
          <div>
            <Button
              disabled={status === -1}
              type="primary"
              style={{ margin: '0 6px 6px 0' }}
              size="small"
              onClick={(): void => {
                setSortModalProps({
                  visible: true,
                  itemData: value,
                  cancelFn: (): void => {
                    setSortModalProps(defaultModalProps)
                  },
                  updataList: (val) => {
                    const str = SortTypeStr[val.orderType as SortTypes]
                    const isCommon = val.orderType === 'COMMON' && val.orderNum === null
                    const setObj = {
                      orderNum: val.orderNum,
                      orderStr: isCommon ? '0' : `${str}${val.orderNum}`,
                      orderType: val.orderType
                    }
                    tableRef.current.updataItem(setObj, index)
                  }
                })
              }}
            >
              排序
            </Button>
            <Button
              disabled={status === -1}
              type="primary"
              style={{ margin: '0 6px 6px 0' }}
              size="small"
              onClick={(): void => {
                setshieldModal({
                  visible: true,
                  itemData: value,
                  cancelFn: (): void => {
                    setshieldModal(defaultModalProps)
                  },
                  updataList: (val) => {
                    tableRef.current.updataItem({
                      ...val,
                      status: -1,
                      statusStr: '已屏蔽'
                    }, index)
                  }
                })
              }}
            >
              屏蔽
            </Button>
          </div>
        )
      }
    }
  ]

  const locationSearch = getParamObj(location.search)
  return (
    <div>
      <SortModal {...sortModalProps} />
      <ShieldModal {...shieldModal} />
      <ReplyModal {...replyModalProps} />
      <ProTable
        // changePage={changePage}
        ref={tableRef}
        api={api}
        overrideSearchParams={locationSearch}
        tableProps={{
          columns
        }}
        searchList={searchList}
        scrollX={1600}
      />
    </div>
  )
}

export default CommentList
