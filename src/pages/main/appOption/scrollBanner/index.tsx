import React, { FC, useRef, MutableRefObject, ReactElement } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import { Button, Space, Modal, ConfigProvider, message } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
// import moment from 'moment'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { isNumber } from 'lodash'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { SearchItem, ListParams } from '@/components/common/table/types'
import style from './style.module.sass'
import ScrollBannerEdit, { ModalEditHandles } from '@/components/main/scrollBanner/ScrollBannerEdit'
import {
  getBannerList, handleBannerStatus, deleteBanner, saveBannerItem, getBannerItem,
  // saveBannerItem
} from '@/api/main/appOption'
import NoneWrap from '@/components/common/noneContent'
import SourceCover from '@/components/common/sourceCover'
import { BannerItemProps, FormDataParams, BannerItemDetailProps, BannerBackEndProps } from './types'
import { BannerTypes } from './data'
import { corverDataToForm, corverDataToBackEnd, mergeBannerObject } from './editFC'

const api = (data: ListParams): AxiosPromise => getBannerList(data)


const ScrollBanner: FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const formRef = useRef<ModalEditHandles>() as MutableRefObject<ModalEditHandles>


  const searchList: SearchItem[] = [
    {
      name: '标题',
      type: 'input',
      key: 'title'
    },
    {
      name: '状态',
      type: 'select',
      key: 'enable',
      selectList: [
        {
          name: '启用',
          key: 'true'
        },
        {
          name: '禁用',
          key: 'false'
        },
      ]
    },
    {
      name: '类型',
      type: 'select',
      key: 'type',
      selectList: [
        {
          name: '文章',
          key: 'ARTICLE'
        },
        {
          name: '比赛',
          key: 'MATCH'
        },
        {
          name: '自定义',
          key: 'CUSTOM'
        },
      ]
    },
    {
      name: '有效期',
      type: 'datePicker',
      key: 'time',
      showTime: true,
    },
  ]

  const toCreateModal = (bannerItem?: BannerItemDetailProps, index?: number): void => {
    const initData = bannerItem ? corverDataToForm(bannerItem) : {}
    Modal.confirm({
      width: '700px',
      title: bannerItem ? '编辑轮播图' : '新增轮播图',
      okText: bannerItem ? '保存' : '创建',
      cancelText: '取消',
      centered: true,
      onCancel: () => new Promise((resolve) => {
        formRef.current.resetForm()
        resolve()
      }),
      onOk: () => new Promise((resolve, reject) => {
        formRef.current.submitForm().then((formRes) => {
          const data = corverDataToBackEnd(formRes as FormDataParams)
          saveBannerItem<BannerBackEndProps, BannerItemDetailProps>({ ...data, id: bannerItem?.id })
            .then((result) => {
              resolve()
              message.success(bannerItem ? '保存成功' : '创建成功')
              const { data: newItem } = result
              if (isNumber(index) && bannerItem) {
                tableRef.current.updataItem(mergeBannerObject(newItem), index)
              } else {
                tableRef.current.updata()
              }
            }).catch(() => {
              // message.error(bannerItem ? '保存失败' : '创建失败')
              reject()
            })
        }).catch(() => {
          reject()
        })
      }),
      content: (
        <ConfigProvider locale={zhCN}>
          <ScrollBannerEdit
            initData={{
              ...initData,
              sort: initData.sort === 0 ? null : initData.sort
            }}
            ref={formRef}
          />
        </ConfigProvider>
      ),
    })
  }

  const columns: ColumnsType = [
    {
      title: '标题',
      width: 300,
      render: (value: BannerItemProps): ReactElement => {
        const { image, type, title } = value
        const imgBgStyle = type === 'ARTICLE'
          ? style.picBg : type === 'MATCH'
            ? style.videoBg : style.inforBg
        return (
          <SourceCover
            title={title}
            img={image}
            imgTypeText={BannerTypes[type]}
            imgStyle={imgBgStyle}
          />
        )
      }
    },
    {
      title: '有效期',
      width: 310,
      render: (value: BannerItemProps): ReactElement => {
        const { startTime, endTime } = value
        return (
          <div style={{ display: 'flex' }}>
            <NoneWrap showText={startTime} />
            &nbsp;至&nbsp;
            <NoneWrap showText={endTime} />
          </div>
        )
      }
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'enable',
      render: (data: boolean): ReactElement => {
        const statusStyle = data ? 'enbale' : 'disable'
        return (
          <div className={style[statusStyle]}>{data ? '启用' : '禁用'}</div>
        )
      }
    },
    {
      title: '排序值',
      width: 100,
      sorter: true,
      key: 'sort',
      dataIndex: 'sort',
      render: (data): ReactElement => (
        <NoneWrap showText={data} />
      )
    },
    {
      title: '创建人',
      width: 100,
      dataIndex: 'creatorName',
    },
    {
      title: '可用操作',
      fixed: 'right',
      width: 260,
      render: (_, value, index): ReactElement => {
        const bannerItem = value as BannerItemProps
        const { enable, id } = bannerItem
        return (
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={(): void => {
                getBannerItem<{ id: string }, BannerItemDetailProps>({ id })
                  .then((result): void => {
                    const { data } = result
                    toCreateModal(data, index)
                  })
              }}
            >
              编辑
            </Button>
            <Button
              size="small"
              type="primary"
              danger={enable}
              className={!enable ? style.greenBtn : ''}
              onClick={(): void => {
                handleBannerStatus({ id, enabled: !enable })
                  .then((): void => {
                    const newObj = { ...bannerItem, enable: !enable }
                    message.success('修改成功')
                    tableRef.current.updataItem(newObj, index)
                  })
              }}
            >
              {enable ? '禁用' : '启用'}
            </Button>
            <Button
              size="small"
              type="primary"
              danger
              onClick={(): void => {
                Modal.confirm({
                  title: '确定删除?',
                  icon: <ExclamationCircleOutlined />,
                  okType: 'primary',
                  okText: '是',
                  cancelText: '否',
                  onOk() {
                    deleteBanner({ id })
                      .then((): void => {
                        message.success('删除成功')
                        tableRef.current.deleteItem(id)
                      })
                  }
                })
              }}
            >
              删除
            </Button>
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
        toCreateModal()
      }}
    >
      新增轮播图
    </Button>
  )

  return (
    <ProTable
      ref={tableRef}
      searchList={searchList}
      headerBtnGroup={headerBtnGroup}
      api={api}
      tableProps={{ columns }}
      scrollX={1200}
    />
  )
}

export default ScrollBanner
