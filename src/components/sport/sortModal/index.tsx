import React, { FC, useEffect } from 'react'
import {
  Modal,
  Form,
  InputNumber,
  message
} from 'antd'
import { ModalProps } from '@/pages/main/comment/types'
import { updateBasketballSort } from '@/api/sport/basketball'

const SortModal: FC<ModalProps> = (props: ModalProps) => {
  const { visible, cancelFn, itemData, updataList } = props
  const [form] = Form.useForm()

  useEffect(() => {
    const { orderNum } = itemData
    if (visible) {
      form.setFieldsValue({
        orderNum
      })
    }
  }, [itemData, visible, form])

  return (
    <Modal
      getContainer={false}
      destroyOnClose
      visible={visible}
      title="设置排序值"
      onCancel={cancelFn}
      onOk={(): void => {
        form.validateFields().then((res) => {
          const { id } = itemData
          const params = {
            ...res,
            id
          }
          updateBasketballSort(params).then(() => {
            message.success('修改成功')
            updataList(res)
            cancelFn()
          })
        })
      }}
    >
      <Form
        form={form}
        labelCol={{
          span: 4
        }}
        wrapperCol={{
          span: 20
        }}
      >
        <Form.Item
          label="排序值"
          name="orderNum"
          rules={[{ required: true, message: '请输入排序值!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={1} precision={0} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SortModal
