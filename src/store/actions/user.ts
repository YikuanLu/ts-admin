import { SET_USER_INFOR, RESET_USER_INFOR } from '@/store/types/user'
import { UserModel } from '@/models/user'

export interface ChangeUserInforAction {
  type: SET_USER_INFOR | RESET_USER_INFOR;
  userInfor?: UserModel;
}

export const setUserInfor = (userInfor: UserModel): ChangeUserInforAction => ({
  type: SET_USER_INFOR,
  userInfor,
})

export const resetUserInfor = (): ChangeUserInforAction => ({
  type: RESET_USER_INFOR,
})
