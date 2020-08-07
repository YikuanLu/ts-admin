import React, { FC } from 'react'
import { Form, Button } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Store } from 'antd/lib/form/interface'
import ProUpload from '@/components/common/upload'

const FormUpload: FC = () => {
  const [form] = useForm()

  const onFinish = (values: Store): void => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: Store): void => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="asdf"
        name="asdf"
        rules={[{
          required: true,
          message: 'asdfasdfasdf'
        }]}
      >
        <ProUpload uploadType="video" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default FormUpload
