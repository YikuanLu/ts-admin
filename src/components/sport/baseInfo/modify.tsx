import React, { FC, useEffect } from 'react'
import { Modal, Form, Input, InputNumber } from 'antd'
import { ModalProps } from '@/pages/main/comment/types'
import { saveSports } from '@/api/sport/base'
import style from './style.module.sass'

const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}

const ModifyModal: FC<ModalProps> = (props: ModalProps) => {
  const [form] = Form.useForm()
  const { visible, itemData, updataList, cancelFn } = props

  useEffect(() => {
    if (visible) {
      const { name, description, orderNum } = itemData
      form.setFieldsValue({
        name, description, orderNum
      })
    }
    // eslint-disable-next-line
  }, [itemData])

  return (
    <Modal
      getContainer={false}
      destroyOnClose
      visible={visible}
      title={itemData.name ? '编辑体育项目' : '创建体育项目'}
      okText="保存"
      onOk={(): void => {
        const { id } = itemData
        form.validateFields().then((res) => {
          saveSports({ ...res, id }).then((): void => {
            updataList(res)
          })
        }).catch((err) => {
          console.log(err)
        })
      }}
      onCancel={cancelFn}
    >
      <Form form={form} {...formItemLayout} labelAlign="right">
        <Form.Item
          label="项目名称"
          name="name"
          rules={[{
            required: true, message: '请输入体育项目名称(长度不超过10)'
          }]}
        >
          <Input placeholder="长度不超过10" maxLength={10} />
        </Form.Item>
        <Form.Item
          label="排序值"
          name="orderNum"
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="只能输入正整数"
            min={1}
          />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea />
        </Form.Item>
      </Form>
      {!itemData.name ? <p className={style.warnText}>请注意，创建成功后无法删除</p> : null}
    </Modal>
  )
}

export default ModifyModal
