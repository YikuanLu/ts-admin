import React, { FC } from 'react'
import { Menu, Dropdown, message } from 'antd'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { useHistory } from 'react-router-dom'
import { UserInfor, UserModel } from '@/models/user'
import { resetUserInfor } from '@/store/actions/user'

import style from './style.module.sass'

interface Prop extends UserInfor {
  resetUserInfor: () => void
}

const HeaderDropdown: FC<Prop> = (props: Prop) => {
  const { userName } = props
  const history = useHistory()
  const firstWord: string = userName.slice(0, 1)

  const logout = (): void => {
    const canLogOut = window.sessionStorage.getItem('canLogOut')
    if (canLogOut !== 'false') {
      props.resetUserInfor()
      message.success('登出成功')
      history.replace('/login')
    } else {
      message.error('页面信息发生变动，请先保存后再退出')
    }
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>
        <span>退出登录</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu} className={`fr ${style.headerDropdown}`}>
      <div>
        <div className={style.avatar}>{firstWord}</div>
        <div>{userName}</div>
      </div>
    </Dropdown>
  )
}

const mapStateToProps = (state: { userReducer: UserModel }): UserInfor => state.userReducer.user

const mapDispatchToProps = (dispatch: Dispatch): { resetUserInfor: () => void } => ({
  resetUserInfor: (): void => {
    dispatch(resetUserInfor())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderDropdown)
