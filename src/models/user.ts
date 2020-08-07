export interface UserInfor {
  id: string;
  userName: string;
  avatar: string;
}

export interface UserModel {
  token: string,
  user: UserInfor
}
