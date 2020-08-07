import React, { useImperativeHandle, RefForwardingComponent, forwardRef, useState } from 'react'
import { Form, DatePicker, Radio } from 'antd'
import { Store, StoreValue } from 'antd/lib/form/interface'
import moment from 'moment'

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}

export interface ModalEditProps {
  initData?: Store
}
export interface ModalEditHandles {
  submitForm: () => Promise<Store>
  resetForm: () => void
}
type RefModal = RefForwardingComponent<ModalEditHandles, ModalEditProps>

const ReleaseModal: RefModal = (props, ref) => {
  const { initData = {} } = props
  const [form] = Form.useForm()
  const [releaseType, saveReleaseType] = useState(true)

  useImperativeHandle(ref, () => ({
    async submitForm(): Promise<Store> {
      const res = await form.validateFields()
      return res
    },
    resetForm(): void {
      form.resetFields()
    }
  }))


  const disabledDate = (current: StoreValue): boolean =>
    // Can not select days before today and today
    current && moment().isAfter(moment(current), 'day')


  return (
    <Form
      form={form}
      {...formItemLayout}
      labelAlign="right"
      initialValues={{
        enable: true,
      }}
      onValuesChange={(_, allValues): void => {
        saveReleaseType(allValues.enable)
      }}
    >
      <Form.Item
        label="文章标题"
      >
        <p style={{ marginBottom: 0 }}>{initData.title}</p>
      </Form.Item>
      <Form.Item
        label="发布类型"
        name="enable"
      >
        <Radio.Group>
          <Radio value>立即发布</Radio>
          <Radio value={false}>定时发布</Radio>
        </Radio.Group>
      </Form.Item>
      {!releaseType && (
        <Form.Item
          label="发布时间"
          name="time"
          rules={[{ required: true, message: '请选择发布时间' }]}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={disabledDate}
            showTime
          />
        </Form.Item>
      )}
    </Form>
  )
}

export default forwardRef(ReleaseModal)
