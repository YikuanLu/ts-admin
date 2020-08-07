import React, {
  FC,
  ReactElement,
  useRef,
  MutableRefObject,
  useState,
  // useEffect,
} from 'react'
import { ColumnsType, TableRowSelection } from 'antd/lib/table/interface'
import {
  Button, message,
  //  Radio,
  Dropdown, Menu, Modal
} from 'antd'
import { useHistory } from 'react-router-dom'
import { AxiosPromise } from 'axios'
import { connect } from 'react-redux'
import { Store } from 'antd/lib/form/interface'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'

import { sportTypesList, SportTypes } from '@/config/data'

import { SearchItem, ListRes } from '@/components/common/table/types'
import {
  // Status,
  Types, Status, MaterialItem
} from '@/pages/main/type'
import {
  getMaterialList,
  quoteMaterial,
  removeMaterials,
  batchAuditMaterials,
  batchAuditFailMaterials
} from '@/api/main'
import { showDefaultProps } from '@/assets/js/public'

import {
  articleTypes,
  ArtTypes,
  materialTypesList,
  isQuote,
  MaterialTypes,
} from '@/pages/main/statusType'

import style from './style.module.sass'
import { SportType } from '@/config/dataTypes'

import NoneWrap from '@/components/common/noneContent'
import { SearchModal } from '@/models/search'

const { confirm } = Modal

const searchList: SearchItem[] = [
  {
    name: '体育项目',
    type: 'select',
    key: 'itemType',
    selectList: sportTypesList
  },
  {
    name: '文章类型',
    type: 'select',
    key: 'type',
    selectList: articleTypes
  },
  {
    name: '处理状态',
    type: 'select',
    key: 'status',
    selectList: materialTypesList
  },
  {
    name: '引用状态',
    type: 'select',
    key: 'quote',
    selectList: isQuote
  },
  {
    name: '文章标题',
    type: 'input',
    key: 'titleOrId',
  },
  {
    name: '关键字',
    type: 'input',
    key: 'keywords',
  },
  {
    name: '采取平台',
    type: 'input',
    key: 'downloadPlatform',
  },
]

const showKeyWordsText = (data: string[]): string | string[] => {
  const arr = data.map(((item: string, index: number) => {
    if (index !== 0) {
      return item
    }
    return item
  }))
  return showDefaultProps(arr)
}

const api = (data: ListRes): AxiosPromise => getMaterialList<ListRes>(data)

interface MaterialListProps {
  searchParams?: Store,
}

const MaterialList: FC<MaterialListProps> = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const history = useHistory()
  const columns: ColumnsType = [
    {
      title: '文章素材',
      width: 300,
      render: (value): ReactElement => {
        const { type } = value
        const imgBgStyle = type === 'PICTURE'
          ? style.picBg : type === 'VIDEO'
            ? style.videoBg : style.inforBg
        return (
          <div title={value.title} className={style.imgTableItem}>
            <div className={style.imgBox}>
              <img
                className={style.img}
                src={value.cover || '--'}
                alt="封面"
              />
              <span className={`${style.typeTip} ${imgBgStyle}`}>
                {ArtTypes[type as Types]}
              </span>
            </div>
            <span className={style.overFlowText}>
              {value.title}
            </span>
          </div>
        )
      },
    },
    {
      title: '原文发布时间',
      width: 160,
      align: 'center',
      render: (value): ReactElement => (
        <div>
          {showDefaultProps(value.releaseTime)}
        </div>
      ),
      key: 'releaseTime',
      sorter: true
    },
    {
      title: '原文浏览数',
      align: 'center',
      render: (value): ReactElement => (
        <div>
          {value.viewNum || 0}
        </div>
      ),
      key: 'viewNum',
      sorter: true,
    },
    {
      title: '原文点赞数',
      align: 'center',
      render: (value): ReactElement => (
        <div>{value.giveNum || 0}</div>
      ),
      key: 'giveNum',
      sorter: true
    },
    {
      title: '原文回复数',
      align: 'center',
      render: (value): ReactElement => (
        <div>{value.shareNum || 0}</div>
      ),
      key: 'shareNum',
      sorter: true
    },
    {
      title: '原文转发数',
      align: 'center',
      render: (value): ReactElement => (
        <div>{value.commentNum || 0}</div>
      ),
      key: 'commentNum',
      sorter: true
    },
    {
      title: '原文收藏数',
      align: 'center',
      render: (value): ReactElement => (
        <div>{value.collectNum || 0}</div>
      ),
      key: 'collectNum',
      sorter: true
    },
    {
      title: '体育项目',
      align: 'center',
      render: (value): ReactElement => (
        <NoneWrap showText={SportTypes[value.itemType as SportType]} />
      ),
    },
    {
      title: '采取平台',
      align: 'center',
      render: (value): ReactElement => (
        <div>{showDefaultProps(value.downloadPlatform)}</div>
      )
    },
    {
      title: '处理状态',
      align: 'center',
      render: (value): ReactElement => {
        const styleType = value.status === 'AUDIT' ? style.successColor : style.failColor
        return (
          <div className={styleType}>{MaterialTypes[value.status as Status]}</div>
        )
      }
    },
    {
      title: '引用状态',
      align: 'center',
      render: (value): ReactElement => {
        const className = value.quote ? style.successColor : style.failColor
        return (
          <div className={className}>
            {value.quote ? '已引用' : '未引用'}
          </div>
        )
      }
    },
    {
      title: '原文频道',
      align: 'center',
      render: (value): ReactElement => {
        const channels = value.channels || []
        const showText = showKeyWordsText(channels).toString()
        return (
          <div title={showText} className="overFlowText">
            {showText}
          </div>
        )
      }
    },
    {
      title: '原文话题',
      align: 'center',
      render: (value): ReactElement => <div>{value.subjectName || '--'}</div>
    },
    {
      title: '关键字',
      align: 'center',
      render: (value): ReactElement => {
        const keywords = value.keywords || []
        const showText = showKeyWordsText(keywords).toString()
        return (
          <div title={showText} className="overFlowText">
            {showText}
          </div>
        )
      }
    },
    {
      title: '采取时间',
      width: 120,
      align: 'center',
      render: (value): ReactElement => <div>{showDefaultProps(value.downloadTime)}</div>
    },
    {
      title: '操作',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: (value): ReactElement => (
        <div>
          <Button
            style={{ margin: '0 6px 6px 0' }}
            type="primary"
            size="small"
            onClick={(): void => {
              history.push({
                pathname: `/material/list/${value.id}`,
                state: 'asdf'
              })
            }}
          >
            详情
          </Button>
          <Button
            style={{ margin: '0 6px 6px 0' }}
            type="primary"
            size="small"
            onClick={(): void => {
              if (!value.link) {
                message.error('无外链')
                return
              }
              window.open(value.link)
            }}
          >
            原文
          </Button>
        </div>
      )
    }
  ]

  const [selectedList, setselectedList] = useState<string[]>([])
  const rowSelection: TableRowSelection<MaterialItem> = {
    selectedRowKeys: selectedList,
    type: 'checkbox',
    fixed: true,
    onChange: (selectedRowKeys) => {
      setselectedList(selectedRowKeys as string[])
    },
  }

  // 校验选择列表是否为空
  const checkEmptyList = (): boolean => {
    if (selectedList.length === 0) {
      message.error('请至少选择一条数据')
      return false
    }
    return true
  }

  // 批量引用素材
  const patchListQuote = (): void => {
    quoteMaterial<{ ids: string[] }>({ ids: selectedList }).then(() => {
      message.success(`已成功引用${selectedList.length}条文章素材，请到文章列表查看`)
      tableRef.current.patchProps(selectedList, {
        quote: true,
        status: 'AUDIT'
      })
      setselectedList([])
    })
  }

  // 批量改变素材状态
  const patchListStatus = (status: Status): void => {
    const params = {
      ids: selectedList
    }
    if (status === 'CREATE') {
      batchAuditFailMaterials(params).then(() => {
        tableRef.current.patchProps(selectedList, { status: 'CREATE' })
        message.success('已标记为未处理')
        setselectedList([])
      })
    }
    if (status === 'AUDIT') {
      batchAuditMaterials(params).then(() => {
        tableRef.current.patchProps(selectedList, { status: 'AUDIT' })
        message.success('已标记为已处理')
        setselectedList([])
      })
    }
  }

  const deleteDatas = (): void => {
    removeMaterials({
      ids: selectedList
    }).then(() => {
      message.success('删除成功')
      tableRef.current.deleteList(selectedList)
      setselectedList([])
    })
  }

  const dropdownMenu = (
    <Menu>
      {materialTypesList.map((item) => (
        <Menu.Item
          onClick={(): void => {
            if (checkEmptyList()) {
              patchListStatus(item.key as Status)
            }
          }}
          key={item.key}
        >
          {item.name}
        </Menu.Item>
      ))}
    </Menu>
  )

  const filterElement = (
    <>
      <Button
        type="link"
        size="small"
        onClick={(): void => {
          if (checkEmptyList()) {
            confirm({
              title: '是否确认删除勾选的文章素材?',
              icon: <ExclamationCircleOutlined />,
              okType: 'primary',
              okText: '是',
              cancelText: '否',
              onOk() {
                deleteDatas()
              }
            })
          }
        }}
      >
        删除
      </Button>
      <Dropdown trigger={['click']} overlay={dropdownMenu}>
        <span className={style.dropdownBtn}>
          <span className={style.dropdownText}>标为</span>
          <DownOutlined />
        </span>
      </Dropdown>
      <Button
        type="link"
        size="small"
        onClick={(): void => {
          if (checkEmptyList()) {
            patchListQuote()
          }
        }}
      >
        引用素材
      </Button>
    </>
  )

  const tabData = {
    key: 'timeFrame',
    list: [
      {
        name: '全部',
        key: 'UNDEFINED'
      },
      {
        name: '7天内',
        key: 'SEVEN_DAY'
      },
      {
        name: '3天内',
        key: 'THREE_DAY'
      },
      {
        name: '今天',
        key: 'TODAY'
      }
    ]
  }

  return (
    <div>
      <ProTable
        tabData={tabData}
        patchClearSelect={(): void => {
          setselectedList([])
        }}
        ref={tableRef}
        selectdCount={
          selectedList.length
        }
        filterElement={filterElement}
        api={api}
        tableProps={{
          columns,
          rowSelection: {
            ...rowSelection,
          }
        }}
        searchList={searchList}
        scrollX={2600}
      />
    </div>
  )
}

const mapStateToProps = (state: { searchReducer: SearchModal }): SearchModal => state.searchReducer

export default connect(
  mapStateToProps
)(MaterialList)
