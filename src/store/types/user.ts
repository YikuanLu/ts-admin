import { UserModel } from '@/models/user'

export const SET_USER_INFOR = 'SET_USER_INFOR'
export type SET_USER_INFOR = typeof SET_USER_INFOR // 写入用户信息

export const RESET_USER_INFOR = 'RESET_USER_INFOR'
export type RESET_USER_INFOR = typeof RESET_USER_INFOR // 重制用户信息

export interface UserAction {
  type: typeof RESET_USER_INFOR | SET_USER_INFOR;
  userInfor?: UserModel;
}
