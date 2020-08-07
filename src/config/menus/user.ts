import { lazy } from 'react'

const userInfoList = lazy(() => import('@/pages/user/userInfo/userList/list'))
const userInfoEdit = lazy(() => import('@/pages/user/userInfo/userList/edit'))

export const userRoutes = [
  {
    name: '用户信息',
    key: 'user-info',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '用户列表',
        key: 'user-info-list',
        isShowInMenu: true,
        subMenu: false,
        path: '/userInfo',
        component: userInfoList
      },
      {
        name: '用户详情',
        key: 'user-info-edit',
        from: 'user-info-list',
        exact: true,
        isShowInMenu: false,
        subMenu: false,
        path: '/userInfo/:type',
        component: userInfoEdit
      }
    ]
  }
]
