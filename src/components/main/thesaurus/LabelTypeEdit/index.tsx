import React, { forwardRef, RefForwardingComponent, useImperativeHandle } from 'react'
import { Form, Input } from 'antd'
import { Store } from 'antd/lib/form/interface'

import style from './style.module.sass'

export interface LabelTypeEditProps {
  formData?: Store
}

export interface LabelTypeEditHandles {
  submitForm: () => Promise<Store>
}

type RefTable = RefForwardingComponent<LabelTypeEditHandles, LabelTypeEditProps>

const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
}

const LabelTypeEdit: RefTable = (
  { formData }: LabelTypeEditProps,
  ref: React.Ref<LabelTypeEditHandles>
) => {
  const [form] = Form.useForm()
  if (formData) {
    form.setFieldsValue({
      name: formData.name,
      description: formData.description
    })
  }
  useImperativeHandle(ref, () => ({
    async submitForm(): Promise<Store> {
      const res = await form.validateFields()
      return res
    }
  }))
  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        style={{
          marginTop: '20px'
        }}
      >
        <Form.Item
          name="name"
          label="分类名称"
          rules={[{
            required: true,
            message: '请输入分类名称'
          }]}
        >
          <Input maxLength={10} />
        </Form.Item>
        <Form.Item name="description" label="分类描述">
          <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
      </Form>
      <div className={style.tip}>
        请注意，创建成功后无法删除
      </div>
    </>
  )
}

export default forwardRef(LabelTypeEdit)
