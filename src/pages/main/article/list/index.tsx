import React, {
  useRef, ReactElement, MutableRefObject, useState,
  // useEffect
} from 'react'
import { connect } from 'react-redux'
import { useHistory, Link, useLocation } from 'react-router-dom'
import { ColumnsType } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import {
  Button,
  // Radio,
  message, Modal, Space, ConfigProvider
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Store, StoreValue } from 'antd/lib/form/interface'
import zhCN from 'antd/es/locale/zh_CN'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import {
  getArticlesList, removeAarticlesStatus,
} from '@/api/main'
import { ListRes, SearchItem } from '@/components/common/table/types'
import { RetractTypes } from '@/pages/main/comment/types'
import {
  ArtTypes,
  StatusText,
  TextColor,
  articleTypes,
  articleStatus,
  SortTypes
} from '@/pages/main/article/statusType'
import { Types, Status, SortType, ArticleItem } from '@/pages/main/article/type'
import { RetractTypeStr } from '@/pages/main/comment/statusType'
import style from './style.module.sass'
import NoneWrap from '@/components/common/noneContent'
import RetractModal from '@/components/main/article/RetractModal'
import { SearchModal } from '@/models/search'
import { getParamObj } from '@/utils/commonFn'
import SourceCover from '@/components/common/sourceCover'
import ReleaseModal from '@/components/main/article/ReleaseModal'

export interface ModalProps {
  visible: boolean,
  itemData?: Store,
  cancelFn: () => void,
  updataList: (val?: StoreValue) => void
}

const { confirm } = Modal

const searchList: SearchItem[] = [
  {
    name: '文章标题',
    type: 'input',
    key: 'title'
  },
  {
    name: '文章类型',
    type: 'select',
    key: 'articlesType',
    selectList: articleTypes
  },
  {
    name: '文章状态',
    type: 'select',
    key: 'status',
    selectList: articleStatus
  },
  {
    name: '所属话题',
    type: 'input',
    key: 'topicName',
  },
  {
    name: '文章作者',
    type: 'input',
    key: 'authorUserName',
  },
  {
    name: '发布时间',
    type: 'rangePicker',
    key: 'releaseTime',
    rangeDateKey: {
      startTime: 'releaseStartTime',
      endTime: 'releaseEndTime'
    }
  },
  {
    name: '创建时间',
    type: 'rangePicker',
    key: 'createTime',
    rangeDateKey: {
      startTime: 'createStartTime',
      endTime: 'createEndTime'
    }
  },
  {
    name: '发布人',
    type: 'input',
    key: 'releaseUserName',
  },
]

const buttonTypeList = {
  NOT_RELEASE: ['edit', 'release', 'delete'],
  REVOKED: ['edit', 'release', 'delete'],
  TO_BE_REVIEW: ['edit', 'revoke'],
  RELEASE: ['edit', 'revoke'],
  TIMED_RELEASE: ['edit', 'unpublish'],
}

const api = (data: ListRes): AxiosPromise => getArticlesList<ListRes>(data)

const defaultModalProps: ModalProps = {
  visible: false,
  itemData: {},
  cancelFn: () => { },
  updataList: () => { },
}

interface ArticleListProps {
  searchParams?: Store,
}
export interface ModalEditHandles {
  submitForm: () => Promise<Store>
  resetForm: () => void
}
const ArticleList: React.FC<ArticleListProps> = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const formRef = useRef<ModalEditHandles>() as MutableRefObject<ModalEditHandles>
  const history = useHistory()
  const location = useLocation()
  const [retractModalPdops, setRetractModalPdops] = useState(defaultModalProps)

  const dispatchButtonEle = (data: ArticleItem, type: string, index: number): ReactElement => {
    switch (type) {
      case 'edit':
        return (
          <Button
            size="small"
            type="primary"
            className={style.blueBtn}
          >
            <Link
              to={`/article/edit?id=${data.id}`}
              target="_blank"
            >
              编辑
            </Link>
          </Button>
        )
      case 'release':
        return (
          <Button
            size="small"
            className={style.greenBtn}
            type="default"
            onClick={(): void => {
              Modal.confirm({
                width: '700px',
                title: '发布文章',
                okText: '发布',
                centered: true,
                cancelText: '取消',
                onCancel: () => new Promise((resolve) => {
                  formRef.current.resetForm()
                  resolve()
                }),
                onOk: () => new Promise((resolve, reject) => {
                  formRef.current.submitForm().then((formRes) => {
                    console.log(formRes)
                    resolve()
                  }).catch(() => {
                    reject()
                  })
                }),
                content: (
                  <ConfigProvider locale={zhCN}>
                    <ReleaseModal
                      initData={{ title: data.title }}
                      ref={formRef}
                    />
                  </ConfigProvider>
                )
              })
            }}
          >
            发布
          </Button>
        )
      case 'delete':
        return (
          <Button
            size="small"
            className={style.redBtn}
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
                  removeAarticlesStatus({
                    id: data.id
                  }).then(() => {
                    message.success('文章删除成功')
                    tableRef.current.deleteItem(data.id)
                  })
                }
              })
            }}
          >
            删除
          </Button>
        )
      case 'revoke':
        return (
          <Button
            size="small"
            danger
            className={style.redBtn}
            type="primary"
            onClick={(): void => {
              setRetractModalPdops({
                visible: true,
                itemData: data,
                cancelFn: (): void => {
                  setRetractModalPdops(defaultModalProps)
                },
                updataList: (formData) => {
                  tableRef.current.updataItem({
                    ...data,
                    status: 'REVOKED',
                    retractType: formData,
                  }, index)
                }
              })
            }}
          >
            撤回
          </Button>
        )
      case 'unpublish':
        return (
          <Button
            size="small"
            danger
            className={style.redBtn}
            type="primary"
            onClick={(): void => {
              Modal.confirm({
                title: '是否确认取消发布该文章?',
                icon: <ExclamationCircleOutlined />,
                okType: 'primary',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                  console.log('enter')
                }
              })
              setRetractModalPdops({
                visible: true,
                itemData: data,
                cancelFn: (): void => {
                  setRetractModalPdops(defaultModalProps)
                },
                updataList: (formData) => {
                  tableRef.current.updataItem({
                    ...data,
                    status: 'REVOKED',
                    retractType: formData,
                  }, index)
                }
              })
            }}
          >
            取消发布
          </Button>
        )

      default:
        return <span />
    }
  }

  const createButtonList = (data: ArticleItem, index: number): ReactElement[] => {
    const list = buttonTypeList[data.status]
    return list.map((item: string): ReactElement =>
      dispatchButtonEle(data, item, index))
  }

  const columns: ColumnsType = [
    {
      title: '文章ID',
      width: 200,
      dataIndex: 'id',
    },
    {
      title: '文章类型',
      width: 100,
      align: 'center',
      render: (value): ReactElement => {
        const type: Types = value.articlesType
        const textColor: string = TextColor[type]
        return (
          <NoneWrap className={style[textColor]} showText={ArtTypes[type as Types]} />
        )
      }
    },
    {
      title: '发布平台',
      width: 100,
      align: 'center',
      render: (value): ReactElement => {
        const showText = value.platformType === 'ADMIN' ? '后台发布' : 'APP发布'
        return (
          <NoneWrap showText={showText} />
        )
      }
    },
    {
      title: '文章标题',
      width: 300,
      render: (value): ReactElement => {
        const { articlesType } = value
        const imgBgStyle = articlesType === 'PICTURE'
          ? style.picBg : articlesType === 'VIDEO'
            ? style.videoBg : style.inforBg
        const typeText = ArtTypes[articlesType as Types]
        return (
          <SourceCover
            title={value.title}
            img={value.cover}
            imgStyle={imgBgStyle}
            imgTypeText={typeText}
          />
        )
      }
    },
    {
      title: '所属话题',
      width: 260,
      align: 'center',
      render: (value): ReactElement => {
        const { topicGroupName = '--', topicName = '--' } = value
        let str = ''
        if (topicGroupName || topicName) {
          str = `#${topicName}（${topicGroupName}）`
        }
        return (
          <NoneWrap showText={str} />
        )
      }
    },
    {
      title: '文章作者',
      align: 'center',
      width: 160,
      render: (value): ReactElement => {
        const content: string = (value.authorUserUuid && value.authorUserName) ? `[${value.authorUserUuid}] ${value.authorUserName}` : '--'
        return (<p title={content} className={style.tableArticleTitle}>{content}</p>)
      }
    },
    {
      title: '文章发布者',
      align: 'center',
      width: 160,
      render: (value): ReactElement => {
        const content: string = (value.releaseUserUuid && value.releaseUserName) ? `[${value.releaseUserUuid}] ${value.releaseUserName}` : '--'
        return (
          <p title={content} className={style.tableArticleTitle}>{content}</p>
        )
      }
    },
    {
      title: '文章时间',
      align: 'center',
      dataIndex: 'releaseTime',
      sorter: true,
      width: 160,
      key: 'releaseTime',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      sorter: true,
      width: 160,
      key: 'createTime',
    },
    {
      title: '发布时间',
      align: 'center',
      dataIndex: 'releaseTime',
      sorter: true,
      width: 160,
      key: 'releaseTime',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '最后修改时间',
      align: 'center',
      dataIndex: 'updateTime',
      sorter: true,
      width: 160,
      key: 'updateTime',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '浏览次数',
      align: 'center',
      dataIndex: 'clickNum',
      sorter: true,
      width: 130,
      key: 'clickNum',
    },
    {
      title: '浏览人数',
      align: 'center',
      dataIndex: 'clickUserNum',
      sorter: true,
      width: 130,
      key: 'clickUserNum',
    },
    {
      title: '回复数',
      align: 'center',
      dataIndex: 'commentNum',
      sorter: true,
      width: 130,
      key: 'commentNum',
    },
    {
      title: '点赞数',
      align: 'center',
      width: 100,
      dataIndex: 'giveNum',
      sorter: true,
      key: 'giveNum',
    },
    {
      title: '权重值',
      align: 'center',
      width: 100,
      sorter: true,
      key: 'sortValue',
      render: (value: StoreValue): ReactElement => {
        const showStatus: SortType = value.sortType || ''
        const textColor: string = SortTypes[showStatus] || ''
        const styleClass = showStatus.toLowerCase()
        return (
          <NoneWrap
            className={style[styleClass]}
            showText={`${textColor}${value.sortValue}`}
          />
        )
      }
    },
    {
      title: '状态',
      align: 'center',
      width: 160,
      render: (value): ReactElement => {
        const showStatus: Status = value.status
        const textColor: string = TextColor[showStatus]
        return (<div className={style[textColor]}>{StatusText[showStatus]}</div>)
      }
    },
    {
      title: '撤回原因',
      align: 'center',
      render: (value): ReactElement => (
        value.retractType
          ? (
            <div className={style.tableArticleTitle}>
              {RetractTypeStr[value.retractType as RetractTypes]}
            </div>
          )
          : <NoneWrap showText="--" />
      )
    },
    {
      title: '可用操作',
      fixed: 'right',
      width: 220,
      render: (_, value, index: number): ReactElement => {
        const itemData = value as ArticleItem
        return (
          <Space>
            {
              createButtonList(itemData, index)
            }
          </Space>
        )
      }
    },
  ]

  const tabData = {
    key: 'released',
    list: [
      {
        name: '全部',
        key: 'UNDEFINED'
      },
      {
        name: '发布中',
        key: '1'
      },
      {
        name: '未发布',
        key: '2'
      }
    ]
  }
  const headerBtnGroup = (
    <Button
      style={{ marginBottom: '10px' }}
      type="primary"
      onClick={(): void => {
        history.push({ pathname: '/article/create' })
      }}
    >
      创建文章
    </Button>
  )
  const locationSearch = getParamObj(location.search)
  return (
    <div>
      <RetractModal {...retractModalPdops} />
      <ProTable
        ref={tableRef}
        tabData={tabData}
        headerBtnGroup={headerBtnGroup}
        overrideSearchParams={locationSearch}
        api={api}
        scrollX={2980}
        tableProps={{ columns }}
        searchList={searchList}
      />
    </div>
  )
}

const mapStateToProps = (state: { searchReducer: SearchModal }): SearchModal => state.searchReducer

export default connect(
  mapStateToProps
)(ArticleList)
