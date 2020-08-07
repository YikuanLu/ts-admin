import React, { FC, useEffect, useState } from 'react'
import {
  Modal,
  Form,
  InputNumber,
  Radio,
  message
} from 'antd'
import { ModalProps, SortTypes } from '@/pages/main/comment/types'
import { sortTypes } from '@/pages/main/comment/statusType'
import { commentOrder } from '@/api/main'

const SortModal: FC<ModalProps> = (props: ModalProps) => {
  const { visible, cancelFn, itemData, updataList } = props
  const [form] = Form.useForm()
  const title = `设置排序值（回复ID:${itemData.id}）`

  const [isCheckOrder, setIsCheckOrder] = useState(false)

  useEffect(() => {
    const { orderType = 'common', orderNum } = itemData
    if (visible) {
      form.setFieldsValue({
        orderType,
        orderNum
      })
    }
    // eslint-disable-next-line
  }, [itemData])

  return (
    <Modal
      getContainer={false}
      destroyOnClose
      visible={visible}
      title={title}
      onCancel={cancelFn}
      onOk={(): void => {
        form.validateFields().then((res) => {
          const { id } = itemData
          res.orderNum = res.orderNum === 0 ? null : res.orderNum
          const params = {
            ...res,
            id
          }
          commentOrder(params).then(() => {
            message.success('修改成功')
            updataList(res)
            cancelFn()
          })
        })
      }}
    >
      <Form
        form={form}
        onFieldsChange={(): void => {
          const orderType = form.getFieldValue('orderType')
          const result = orderType !== 'COMMON'
          setIsCheckOrder(result)
        }}
      >
        <Form.Item
          label="排序方式"
          name="orderType"
          rules={[{ required: true, message: '请选择排序方式!' }]}
        >
          <Radio.Group>
            {
              sortTypes.map((item: { name: string, key: SortTypes }) => (
                <Radio value={item.key} key={item.key}>{item.name}</Radio>
              ))
            }
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="排序值"
          name="orderNum"
          rules={[{ required: isCheckOrder, message: '请输入排序值!' }]}
        >
          <InputNumber min={isCheckOrder ? 1 : 0} precision={0} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SortModal
