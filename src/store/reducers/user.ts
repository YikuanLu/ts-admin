import { UserModel } from '@/models/user'
import { UserAction, SET_USER_INFOR, RESET_USER_INFOR } from '@/store/types/user'


const initInfor: UserModel = {
  token: '',
  user: {
    id: '',
    userName: '',
    avatar: ''
  }
}

const userReducer = (state: UserModel = initInfor, action: UserAction): UserModel => {
  if (action.type === RESET_USER_INFOR) {
    return {
      ...initInfor,
    }
  }
  if (action.type === SET_USER_INFOR && action.userInfor) {
    const { userInfor } = action
    return {
      ...userInfor,
    }
  }
  return state
}

export default userReducer
