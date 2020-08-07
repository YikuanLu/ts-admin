import React, { FC, useEffect } from 'react'
import { Modal, Form, Select, message } from 'antd'
import { ModalProps } from '@/pages/main/comment/types'
import { shieldTypes } from '@/pages/main/comment/statusType'
import { commentClose } from '@/api/main'

const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}

const ShieldModal: FC<ModalProps> = (props: ModalProps) => {
  const [form] = Form.useForm()
  const { visible, itemData, cancelFn, updataList } = props

  useEffect(() => {
    if (visible) {
      const { closeRemark } = itemData
      form.setFieldsValue({
        closeRemark
      })
    }
  }, [itemData, visible, form])

  const title = `屏蔽（回复ID:${itemData.id}）`
  return (
    <Modal
      getContainer={false}
      destroyOnClose
      visible={visible}
      title={title}
      onOk={(): void => {
        form.validateFields().then((res) => {
          const params = {
            ...res,
            id: itemData.id
          }
          commentClose(params).then(() => {
            message.success('修改成功')
            updataList(res)
            cancelFn()
          })
        })
      }}
      onCancel={cancelFn}
    >
      <Form form={form} {...formItemLayout} labelAlign="left">
        <Form.Item
          label="原因"
          name="closeRemark"
          rules={[{ required: true, message: '请选屏蔽原因!' }]}
        >
          <Select style={{ width: '100%' }}>
            {
              shieldTypes.map((item) => (
                <Option value={item.key} key={item.key}>{item.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ShieldModal
