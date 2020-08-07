import React, { FC } from 'react'
import { Modal, Form, Select, message } from 'antd'
import { ModalProps } from '@/pages/main/comment/types'
import { retractTypeList } from '@/pages/main/comment/statusType'
import { revokedAarticles } from '@/api/main'

import style from './RetractModal.module.sass'

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

  const title = `撤回（ID:${itemData.id}）`
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
          revokedAarticles(params).then(() => {
            message.success('文章撤回成功')
            updataList(res.retractType)
            cancelFn()
          })
        })
      }}
      onCancel={cancelFn}
    >
      <Form form={form} {...formItemLayout} labelAlign="left">
        <Form.Item
          label="原因"
          name="retractType"
          rules={[{ required: true, message: '请选择撤回原因!' }]}
        >
          <Select style={{ width: '100%' }}>
            {
              retractTypeList.map((item) => (
                <Option value={item.key} key={item.key}>{item.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
      </Form>
      <div className={style.remind}>撤回后用户无法查看该文章</div>
    </Modal>
  )
}

export default ShieldModal
