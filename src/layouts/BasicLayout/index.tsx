import React, { useEffect, useRef } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Modal } from 'antd'
import RootMenu from '@/components/public/menu'
import Header from '@/components/public/header'
import menus from '@/config/menus'
import { MenuItem, Store } from '@/global'
// import menus from '@/components/public/menu/menus'
import style from './style.module.sass'
import { getAreaList } from '@/api/common'
import {
  setAreaList,
} from '@/store/actions/common'
import { initData } from '@/layouts/BasicLayout/initSearchData'
import {
  setSearchParams,
} from '@/store/actions/search'
import { AreaItem, CommonModel } from '@/models/common'

interface MapDispatchToProps {
  areaList?: AreaItem[];
  setAreaList: (arealist: AreaItem[]) => void;
  setSearchParams?: (arealist: Store) => void;
}
interface Props extends MapDispatchToProps {
  children?: React.ReactNode;
}

const getCurrentKey = (data: MenuItem[], pathname: string): string[] => {
  const arr: string[] = []

  const loopMenu = (rootMenu: MenuItem[]): MenuItem[] =>
    rootMenu.map((item: MenuItem) => {
      const { path = '' } = item
      if (item.routes && item.routes.length > 0) {
        loopMenu(item.routes)
      }
      if (item.path && pathname.includes(item.path)) {
        const matchRoute = path.split('/')
        const newPathname = pathname.split('/').slice(0, matchRoute.length)
        if (matchRoute.join('/') === newPathname.join('/')) {
          arr.push(item.key)
        }
      }
      return item
    })
  loopMenu(data)
  return arr
}

const BasicLayout: React.FC<Props> = ({
  children,
  setAreaList: toSetAreaList,
  setSearchParams: setSearch,
  areaList
}: Props) => {
  const location = useLocation()
  const history = useHistory()
  const arr = getCurrentKey(menus, location.pathname)
  useEffect(() => {
    if (history.location.pathname === '/login' || areaList?.length !== 0) return
    getAreaList({}).then((res): void => {
      const { data: rsp } = res
      toSetAreaList(rsp as AreaItem[])
    })

    Modal.destroyAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname])

  // 处理全局列表搜索条件(父子页面不清空，非父子页面清空)
  const preLocation = useRef('')

  useEffect(() => {
    const perUrl = preLocation.current
    const locationStr = location.pathname
    const longStr = locationStr.length > perUrl.length ? locationStr : perUrl
    const shortStr = locationStr.length < perUrl.length ? locationStr : perUrl
    if (perUrl === '' && setSearch) {
      let obj: Store = {}
      obj[locationStr] = {}
      obj = {
        ...obj,
        ...initData
      }
      setSearch(obj)
    }
    if (
      // 不需要清空搜索条件
      !(longStr.includes(shortStr)
        && shortStr !== ''
        && locationStr.length !== perUrl.length)
    ) {
      // 需要清空搜索条件
      let obj: Store = {}
      obj[perUrl] = {}
      obj = {
        ...obj,
        ...initData
      }
      if (setSearch) {
        setSearch(obj)
      }
    }

    preLocation.current = history.location.pathname
  }, [history, location, setSearch])


  return (
    <div className={style.basicLayout}>
      <RootMenu className={style.menu} defaultSelectedKeys={arr} />
      <section className={style.mainContent}>
        <Header />
        <div className={style.container}>
          <div className={style.content}>
            {children || null}
          </div>
        </div>
      </section>
    </div>
  )
}


const mapStateToProps = (state: { commonReducer: CommonModel }): CommonModel => state.commonReducer

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => ({
  setAreaList(arealist: AreaItem[]): void {
    dispatch(setAreaList(arealist))
  },
  setSearchParams(data): void {
    dispatch(setSearchParams(data))
  }
})


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BasicLayout)
