import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '@/api/user'
import { Store } from '@/global'
import { UserModel, UserInfor } from '@/models/user'

import style from './style.module.sass'

export interface Props {
  token: string;
  user: UserInfor;
  setUserInfor: (userInfor: UserModel) => void;
}

interface FormProps extends Store {
  userName?: string;
  password?: string
}

const LoginUi: React.FC<Props> = ({ setUserInfor }: Props) => {
  const history = useHistory()

  const [isLoading, setIsloading] = useState(false)

  const onFinish = async (values: FormProps): Promise<void> => {
    setIsloading(true)
    try {
      const res = await login<FormProps>(values)
      const result = res.data
      setUserInfor(result as UserModel)
      setIsloading(false)
      message.success('登录成功')
      history.replace('/material/list')
    } catch (err) {
      setIsloading(false)
    }
  }

  const FormVm = (
    <Form
      name="normal_login"
      className={style.formBox}
      // initialValues={{ userName: 'admin', password: '123456' }}
      onFinish={onFinish}
    >
      <Form.Item
        name="userName"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="请输入用户名"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="请输入密码"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className={style.loginBtn} loading={isLoading}>
          登录
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <div className={style.login}>
      <div className={style.title}>众创汇管理后台</div>
      {FormVm}
    </div>
  )
}

export default LoginUi
