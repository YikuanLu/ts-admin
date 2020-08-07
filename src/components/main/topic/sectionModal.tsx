import React, { FC, useEffect, useState } from 'react'
import { Modal, Form, Input } from 'antd'
import { ModalProps } from '@/pages/main/topic/sectionList/types'

const { TextArea } = Input
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}
const SectionModal: FC<ModalProps> = (props: ModalProps) => {
  const { visible, cancelFn, updataList, initData } = props
  const [form] = Form.useForm()
  const [title, setTitle] = useState('')

  const checkForm = (): void => {
    form.validateFields().then((result): void => {
      updataList(result)
      form.resetFields()
    })
  }

  useEffect((): void => {
    if (initData) {
      setTitle(Object.keys(initData).length > 0 ? '编辑版块' : '新建版块')
      form.setFieldsValue({ ...initData, sort: initData.sort || null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData])
  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onCancel={(): void => { cancelFn(); form.resetFields() }}
      onOk={(): void => { checkForm() }}
    >
      <Form
        form={form}
      >
        <Form.Item
          {...formItemLayout}
          name="name"
          label="版块标题"
          rules={[{ required: true, message: '请输入版块标题，长度最长不超过10' }]}
        >
          <Input
            maxLength={10}
            placeholder="请输入版块标题，长度最长不超过10"
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="description"
          label="描述"
        >
          <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="sort"
          label="排序值"
          rules={[{
            validator: (_, value): Promise<void> =>
              new Promise((resolve, reject) => {
                if ((value > 0) || !value) {
                  resolve()
                } else {
                  reject('请输入大于0的整数')
                }
              })
          }]}
        >
          <Input
            placeholder="只能输入正数"
            type="number"
            min={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default SectionModal
