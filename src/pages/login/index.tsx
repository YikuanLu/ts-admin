import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { UserModel } from '@/models/user'
import {
  setUserInfor,
  //  resetUserInfor
} from '@/store/actions/user'

import LoginUi from './ui'

export interface MapDispatchToProps {
  setUserInfor: (userInfor: UserModel) => void;
}

const mapStateToProps = (state: { userReducer: UserModel }): UserModel => state.userReducer

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => ({
  setUserInfor(userInfor: UserModel): void {
    dispatch(setUserInfor(userInfor))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginUi)
