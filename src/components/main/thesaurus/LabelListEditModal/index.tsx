import React, { FC, useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Select } from 'antd'
import { ModalProps, SectionItem } from '@/pages/main/topic/sectionList/types'

import style from './style.module.sass'
import { getArticleLabel } from '@/api/main/thesaurus'
import { SelectItem } from '@/components/common/table/types'

const { TextArea } = Input
const { Option } = Select
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}
const LabelListEditModal: FC<ModalProps> = (props: ModalProps) => {
  const { visible, cancelFn, updataList, initData } = props
  const [form] = Form.useForm()
  const [title, setTitle] = useState('新建')
  const [labelTypeList, setLabelTypeList] = useState<SelectItem[]>([])

  const checkForm = (): void => {
    form.validateFields().then((result): void => {
      updataList(result)
      form.resetFields()
    })
  }

  const onSearchLabelType = (name?: string): void => {
    getArticleLabel({ name }).then((res): void => {
      const { content = [] } = res.data
      const arr = content.map(
        ((item: SectionItem): SelectItem => (
          { name: item.name, key: item.id }
        ))
      )
      setLabelTypeList(arr)
    })
  }

  useEffect((): void => {
    onSearchLabelType()
    if (initData) {
      setTitle(Object.keys(initData).length > 0 ? '编辑' : '新建')
      form.setFieldsValue(initData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData])

  return (
    <Modal
      destroyOnClose
      closable={false}
      title={`${title}标签`}
      visible={visible}
      onCancel={(): void => { cancelFn(); form.resetFields() }}
      onOk={(): void => { checkForm() }}
      footer={(
        <div>
          <div>
            <Button
              onClick={(): void => {
                cancelFn(); form.resetFields()
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={(): void => {
                checkForm()
              }}
            >
              {initData && Object.keys(initData).length > 0 ? '保存' : '创建'}

            </Button>
          </div>
          <p className={style.tip}>请注意，创建成功后无法删除</p>
        </div>
      )}
    >
      <Form
        form={form}
      >
        <Form.Item
          {...formItemLayout}
          name="name"
          label="标签名称"
          rules={[{ required: true, message: '请输入标签名称' }]}
        >
          <Input placeholder="尽量保持针对性，长度不超过20" maxLength={20} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="groupId"
          label="所属分类"
          rules={[{ required: true, message: '请选择标签所属分类' }]}
        >
          <Select
            filterOption={false}
            showSearch
            onSearch={onSearchLabelType}
            allowClear
            onBlur={(): void => { onSearchLabelType() }}
            placeholder="选择所属分类"
            onChange={(): void => {
              onSearchLabelType()
            }}
          >
            {
              labelTypeList.map((item): React.ReactElement => (
                <Option key={item.key} value={item.key}>{item.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="description"
          label="描述"
        >
          <TextArea
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default LabelListEditModal
