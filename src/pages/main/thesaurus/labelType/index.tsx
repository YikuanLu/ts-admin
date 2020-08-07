import React, { FC, ReactElement, useRef, MutableRefObject } from 'react'

import { AxiosPromise } from 'axios'
import { ColumnsType } from 'antd/lib/table'
import { Button, Modal, message } from 'antd'
import { StoreValue } from 'antd/lib/form/interface'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { SearchItem, ListParams } from '@/components/common/table/types'
import { getArticleLabel, updatArticleLabel } from '@/api/main/thesaurus'
import { LabelListModels } from '../types'

import NoneWrap from '@/components/common/noneContent'
import LabelTypeEdit, { LabelTypeEditHandles } from '@/components/main/thesaurus/LabelTypeEdit'

// 新增或修改接口参数
interface UpdataParams {
  name: string,
  id?: number,
  description?: string
}

interface CreateModalProps {
  type: 'add' | 'updata',
  data?: LabelListModels
}

const api = (data: ListParams): AxiosPromise => getArticleLabel<LabelListModels>(data)

const searchList: SearchItem[] = [
  {
    name: '标签分类名称',
    type: 'input',
    key: 'name'
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

const LabelType: FC = () => {
  const formRef = useRef<LabelTypeEditHandles>() as MutableRefObject<LabelTypeEditHandles>
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>

  // 新增
  const addData = (
    params: UpdataParams,
    resolve: (value?: unknown) => void,
    reject: (reason?: StoreValue) => void
  ): void => {
    updatArticleLabel<UpdataParams>(params).then(() => {
      message.success('添加成功')
      resolve()
      tableRef.current.updata()
    }).catch(() => {
      reject()
    })
  }

  const updataData = (
    params: UpdataParams,
    index: number,
    resolve: (value?: unknown) => void,
    reject: (reason?: StoreValue) => void
  ): void => {
    updatArticleLabel<UpdataParams>(params).then((res) => {
      const { data } = res
      message.success('修改成功')
      resolve()
      tableRef.current.updataItem({
        description: data.description,
        name: data.name,
        updateTime: data.updateTime,
      }, index)
    }).catch(() => {
      reject()
    })
  }

  // 创建弹窗
  const createModal = (modalProps: CreateModalProps, index = 0): void => {
    const title = `${modalProps.type === 'add' ? '创建' : '编辑'}标签分类`
    Modal.confirm({
      title,
      centered: true,
      width: 520,
      onCancel: () => new Promise((resolve) => {
        resolve()
      }),
      onOk: () => new Promise((resolve, reject) => {
        formRef.current.submitForm().then((formRes) => {
          const params: UpdataParams = {
            name: formRes.name,
            description: formRes.description,
            id: modalProps.data?.id
          }
          if (modalProps.type === 'add') {
            addData(params, resolve, reject)
          }
          if (modalProps.type === 'updata') {
            updataData(params, index, resolve, reject)
          }
        }).catch(() => {
          reject()
        })
      }),
      content: (
        <LabelTypeEdit ref={formRef} formData={modalProps.data} />
      )
    })
  }

  const columns: ColumnsType = [
    {
      title: '标签分类名称',
      width: 180,
      render: (value): ReactElement => (
        <NoneWrap showText={value.name} />
      )
    },
    {
      title: '描述',
      width: 200,
      align: 'center',
      render: (value): ReactElement => (
        <div className="overFlowText" title={value.description}>
          <NoneWrap showText={value.description} />
        </div>
      )
    },
    {
      title: '分类下标签数',
      width: 200,
      align: 'center',
      render: (value): ReactElement => (
        <div>{value.count || 0}</div>
      ),
      sorter: true,
      key: 'count',
    },
    {
      title: '创建人',
      width: 200,
      align: 'center',
      render: (value): ReactElement => (
        <NoneWrap showText={value.createName} />
      )
    },
    {
      title: '创建时间',
      width: 200,
      align: 'center',
      render: (value): ReactElement => (
        <NoneWrap showText={value.createTime} />
      ),
      sorter: true,
      key: 'createTime',
    },
    {
      title: '最后更新时间',
      width: 200,
      align: 'center',
      render: (value): ReactElement => (
        <NoneWrap showText={value.updateTime} />
      ),
      sorter: true,
      key: 'updateTime',
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (value, _, index): ReactElement => (
        <Button
          type="primary"
          size="small"
          onClick={(): void => {
            createModal({
              type: 'updata',
              data: value
            }, index)
          }}
        >
          编辑
        </Button>
      )
    }
  ]

  const headerBtnGroup = (
    <Button
      style={{
        marginBottom: '10px'
      }}
      type="primary"
      onClick={(): void => {
        createModal({
          type: 'add'
        })
      }}
    >
      创建标签分类
    </Button>
  )

  return (
    <div>
      <ProTable
        ref={tableRef}
        headerBtnGroup={headerBtnGroup}
        api={api}
        scrollX={1800}
        tableProps={{ columns }}
        searchList={searchList}
      />
    </div>
  )
}

export default LabelType
