import { lazy } from 'react'
import { MenuItem } from '@/global'

import { mainRoutes } from './main'
import { sportRoutes } from './sport'
import { userRoutes } from './user'

const Demo = lazy(() => import('@/demo'))

const menus: MenuItem[] = [
  {
    name: 'Demo',
    key: 'demo',
    subMenu: false,
    isShowInMenu: false,
    path: '/demo',
    component: Demo
  },
  {
    name: '内容管理',
    key: 'main',
    isShowInMenu: true,
    subMenu: true,
    routes: mainRoutes
  },
  {
    name: '比赛管理',
    key: 'sport',
    isShowInMenu: true,
    subMenu: true,
    routes: sportRoutes
  },
  {
    name: '用户管理',
    key: 'user',
    isShowInMenu: true,
    subMenu: true,
    routes: userRoutes
  }
]

export default menus
