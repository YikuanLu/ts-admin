import React, { FC, useState, ReactElement, MutableRefObject, useRef } from 'react'

import { useHistory } from 'react-router-dom'
import {
  Button,
  //  Modal,
  // message
} from 'antd'
// import { ExclamationCircleOutlined } from '@ant-design/icons'
import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table/interface'
import { SearchItem, ListParams } from '@/components/common/table/types'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { ModalProps } from '@/pages/sport/basketball/types'

import {
  getBasketballMatchList,
  // patchBasketballStatus
} from '@/api/sport/basketball'

// import style from './style.module.sass'

import SortModal from '@/components/sport/sortModal'
import NoneWrap from '@/components/common/noneContent'
import ShowName from '@/components/sport/showName'

const api = (data: ListParams): AxiosPromise => getBasketballMatchList(data)

const searchList: SearchItem[] = [
  {
    name: '赛事名称',
    type: 'input',
    key: 'name',
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

const defaultModalProps: ModalProps = {
  visible: false,
  itemData: {},
  cancelFn: () => { },
  updataList: () => { },
}

const BasketballMatch: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const [sortModalProps,
    //  setSortModalProps
  ] = useState(defaultModalProps)
  const history = useHistory()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const changeStatusSuccess = (data: any, index: number): void => {
  //   const obj = {
  //     ...data,
  //     forbidden: !data.forbidden
  //   }
  //   tableRef.current.updataItem(obj, index)
  //   message.success('修改成功')
  // }

  const columns: ColumnsType = [
    // {
    //   title: 'ID',
    //   width: 200,
    //   dataIndex: 'id'
    // },
    {
      title: '赛事名称',
      width: 200,
      render: (value): ReactElement => {
        const { name, englishName, logo } = value
        return <ShowName name={name} englishName={englishName} logo={logo} />
      }
    },
    {
      title: '简称',
      align: 'center',
      render: (value): ReactElement => {
        const { shortName, englishShortName } = value
        return <ShowName name={shortName} englishName={englishShortName} />
      }
    },
    {
      title: '所属区域',
      align: 'center',
      render: (value): ReactElement => {
        const { region } = value
        return <NoneWrap showText={region} />
      }
    },
    {
      title: '所属国家',
      align: 'center',
      render: (value): ReactElement => {
        const { country } = value
        return <NoneWrap showText={country} />
      }
    },
    // {
    //   title: '状态',
    //   align: 'center',
    //   render: (value): ReactElement => {
    //     const { forbidden } = value
    //     const styleName = forbidden ? style.disable : style.enable
    //     return (
    //       <div className={styleName}>
    //         {forbidden ? '· 禁用' : '· 启用'}
    //       </div>
    //     )
    //   }
    // },
    {
      title: '文章数',
      align: 'center',
      width: 110,
      dataIndex: 'articleNum',
      sorter: true,
      key: 'articleNum',
    },
    // {
    //   title: '话题数',
    //   align: 'center',
    //   width: 110,
    //   dataIndex: 'subjectNum',
    //   sorter: true,
    //   key: 'subjectNum',
    // },
    {
      title: '资讯热度',
      align: 'center',
      width: 110,
      dataIndex: 'informationHot',
      sorter: true,
      key: 'informationHot',
    },
    {
      title: '资讯人气',
      align: 'center',
      width: 110,
      dataIndex: 'informationPopularity',
      sorter: true,
      key: 'informationPopularity',
    },
    {
      title: '赛事热度',
      align: 'center',
      dataIndex: 'matchHot'
    },
    {
      title: '赛事人气',
      align: 'center',
      dataIndex: 'matchPopularity'
    },
    // {
    //   title: '排序',
    //   align: 'center',
    //   dataIndex: 'orderNum'
    // },
    {
      title: '创建时间',
      align: 'center',
      width: 160,
      render: (value): ReactElement => {
        const { createTime } = value
        return <NoneWrap showText={createTime} />
      }
    },
    {
      title: '最后更新时间',
      align: 'center',
      width: 160,
      render: (value): ReactElement => {
        const { updateTime } = value
        return <NoneWrap showText={updateTime} />
      }
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 200,
      render(value, _): ReactElement {
        return (
          <div>
            <Button
              size="small"
              style={{
                marginRight: '10px'
              }}
              type="primary"
              onClick={(): void => {
                history.push(`/basketball/match/${value.id}`)
              }}
            >
              详情
            </Button>
            {/* <Button
              size="small"
              style={{
                marginRight: '10px'
              }}
              type="primary"
              onClick={(): void => {
                setSortModalProps({
                  visible: true,
                  itemData: value,
                  cancelFn: (): void => {
                    setSortModalProps(defaultModalProps)
                  },
                  updataList: (val) => {
                    tableRef.current.updataItem(val, index)
                  }
                })
              }}
            >
              排序
            </Button> */}
            {/* {
              value.forbidden === true
              && (
                <Button
                  size="small"
                  type="default"
                  className={style.successBtn}
                  onClick={(): void => {
                    Modal.confirm({
                      title: '确认开启？',
                      icon: <ExclamationCircleOutlined />,
                      onOk() {
                        patchBasketballStatus(
                          { id: value.id }
                        ).then(() => {
                          changeStatusSuccess(value, index)
                        })
                      },
                    })
                  }}
                >
                  启用
                </Button>
              )
            } */}
            {/* {
              value.forbidden === false
              && (
                <Button
                  size="small"
                  type="primary"
                  danger
                  onClick={(): void => {
                    Modal.confirm({
                      title: '确认关闭？',
                      icon: <ExclamationCircleOutlined />,
                      onOk() {
                        patchBasketballStatus({ id: value.id }).then(() => {
                          changeStatusSuccess(value, index)
                        })
                      },
                    })
                  }}
                >
                  禁用
                </Button>
              )
            } */}
          </div>
        )
      }
    }
  ]
  return (
    <div>
      <SortModal {...sortModalProps} />
      <ProTable
        ref={tableRef}
        api={api}
        tableProps={{
          columns,
        }}
        searchList={searchList}
        scrollX={2000}
      />
    </div>
  )
}

export default BasketballMatch
