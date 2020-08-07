import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Menu } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { UnorderedListOutlined } from '@ant-design/icons'
import { isObject } from 'lodash'
import menus from '@/config/menus'
import { MenuItem } from '@/global'
import logo from '@/assets/img/ilogo.png'
import style from './style.module.sass'

interface Props {
  defaultSelectedKeys: string[];
  className?: string
}
interface MenuListObj {
  [PropsName: string]: MenuItem
}
const RootMenu: FC<Props> = ({ defaultSelectedKeys, className: CLN }: Props) => {
  const { SubMenu } = Menu
  const history = useHistory()
  const { pathname } = useLocation()
  const [defaultOpenKeys, saveDefaultOpenKeys] = useState<string[]>()
  const [hasOpenKeys, saveHasOpenKeys] = useState<string[]>()
  const [menuList, setMenuList] = useState<MenuListObj>({})
  const [selectedKeys, setSelectedKeys] = useState<string[]>(defaultSelectedKeys)
  const [isInlineCollapsed, setInlineCollapsed] = useState(true)

  const createRoute = (data: MenuItem[]): (ReactElement | null)[] => data.map((item) => {
    if (item.subMenu && item.routes && item.isShowInMenu) {
      return (
        <SubMenu
          icon={<UnorderedListOutlined />}
          className="noselect"
          key={item.key}
          title={(
            <span>{item.name}</span>
          )}
        >
          {createRoute(item.routes)}
        </SubMenu>
      )
    }
    if (item.isShowInMenu) {
      return (
        <Menu.Item
          className="noselect"
          onClick={(): void => {
            history.push(item.path || '')
          }}
          key={item.key}
        >
          {item.name}
        </Menu.Item>
      )
    }
    return null
  })

  const toChangeView = (): void => {
    if (window.innerWidth < 990) {
      setInlineCollapsed(true)
      saveHasOpenKeys([])
    }
    if (window.innerWidth > 990) {
      setInlineCollapsed(false)
    }
  }

  const getOpenKeys = (): void => {
    const arr: (string)[] = []
    arr.push(...defaultSelectedKeys)
    const loopData = (): void => {
      if (menuList[arr[0]] && menuList[arr[0]].parentKey !== null) {
        arr.unshift(`${menuList[arr[0]].parentKey}`)
        loopData()
      }
    }
    loopData()
    saveDefaultOpenKeys(arr)
    saveHasOpenKeys(arr)
    toChangeView()
  }

  const handleMenuList = (): void => {
    const obj: MenuListObj = {}
    const loopDatas = (list: MenuItem[], parentKey: null | string): void => {
      list.map((item: MenuItem) => {
        obj[item.key] = { ...item, parentKey }
        if (item.subMenu === true && item.routes !== undefined && item.routes.length > 0) {
          loopDatas(item.routes, item.key)
        }
        return item
      })
    }
    loopDatas(menus, null)
    setMenuList(obj)
  }
  const handleSelectItem = (): void => {
    // eslint-disable-next-line array-callback-return
    Object.entries(menuList).map(([_, val]): void => {
      if (val.path === pathname) {
        setSelectedKeys([val.key])
      }
      if (val.path === pathname && val.from) {
        setSelectedKeys([val.from])
      }
      // if(item.)
    })
  }

  const resizeBind = (): void => {
    toChangeView()
  }

  useEffect((): void => {
    handleMenuList()
    window.addEventListener('resize', resizeBind)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect((): void => {
    if (isObject(menuList) && Object.keys(menuList).length > 0) {
      getOpenKeys()
      handleSelectItem()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuList, pathname])

  return (
    <div className={`${style.rootMenu} ${CLN}`}>
      <div className={style.logo}>
        <img src={logo} alt="众创汇" />
      </div>
      <Menu
        selectedKeys={selectedKeys}
        onOpenChange={(openKeys: string[]): void => {
          saveHasOpenKeys(openKeys)
        }}
        openKeys={hasOpenKeys}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        theme="dark"
        inlineCollapsed={isInlineCollapsed}
      >
        {
          createRoute(menus)
        }
      </Menu>
    </div>
  )
}


export default RootMenu
