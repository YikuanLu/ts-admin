import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  RefForwardingComponent,
  ReactElement,
  useCallback
} from 'react'
import { connect } from 'react-redux'
import {
  Table, Radio,
} from 'antd'
import _ from 'lodash'
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table/interface'
import { PaginationConfig } from 'antd/lib/pagination/Pagination'
import { useHistory } from 'react-router-dom'
import { Store, StoreValue } from 'antd/lib/form/interface'
import { Dispatch } from 'redux'
import { AnyProps, ProTableProps, ListParams } from './types'
import SearchForm from '@/components/common/table/searchForm'

import { processData } from '@/utils/commonFn'

import style from './searchFormStyle.module.sass'
import { SearchModal } from '@/models/search'
import { setSearchParams } from '@/store/actions/search'
import { setTabDefaultVal } from './tableFn'

export interface ProTableHandles {
  updata(val?: boolean, data?: object): void,
  deleteItem(id: string | number): void,
  updataItem(data: object, index: number): void,
  getList<T>(): T[],
  setSearchParamsInTable(val: Store): void,
  patchProps(idList: string[], params: Store): void,
  deleteList(idList: string[]): void
}

type RefTable = RefForwardingComponent<ProTableHandles, ProTableProps>

const ProTable: RefTable = (
  props: ProTableProps,
  ref: React.Ref<ProTableHandles>
) => {
  const history = useHistory()
  const {
    tabData,
    tabValueChange,
    tableProps,
    searchList = [],
    api,
    headerBtnGroup,
    filterElement,
    scrollX = 1800,
    searchParams,
    overrideSearchParams,
    unInitData,
    setSearchParams: setSearchFn,
    filterProps,
    patchClearSelect,
    selectdCount
  } = props

  const { columns = [] } = tableProps
  const [total, setTotal] = useState(0)
  const [showPage, setShowPage] = useState(1)
  const key = history.location.pathname
  const curObj = searchParams?.[key] || {}

  const resultData = _.cloneDeep(curObj)

  // tab的默认值
  const tabDefaultVal = setTabDefaultVal(resultData, tabData)

  const [tabFilter, setTabFilter] = useState<string>(tabDefaultVal)

  if (tabData) {
    resultData[tabData.key] = resultData[tabData.key] === 'UNDEFINED'
      ? undefined
      : resultData[tabData.key]
  }

  const tablePaginationConfig: TablePaginationConfig = {
    current: showPage,
    total,
    showSizeChanger: true,
    pageSizeOptions: ['10', '30', '50', '100'],
    defaultPageSize: resultData.size || 10,
    showTotal: (totalNum) => `共${totalNum}条`
  }

  const defaultParams: ListParams = {
    page: resultData.page || 0,
    size: resultData.size || 10,
    ...filterProps,
    ...resultData,
    ...overrideSearchParams
  }

  const [listParams, setlistParams] = useState<ListParams>(defaultParams)
  const [isInit, setisInit] = useState(true)
  const [isLoad, setIsLoad] = useState(false)
  const [listData, setListData] = useState<StoreValue[]>([])

  // 在redux存储搜索数据
  const saveStoreData = (data: Store): void => {
    if (setSearchFn) {
      const saveObj: Store = {}
      saveObj[key] = data
      setSearchFn(saveObj)
    }
  }

  // 请求数据方法
  const getData = (params: ListParams): void => {
    setIsLoad(true)
    api(params).then((res) => {
      const { data } = res
      setListData(data.content)
      setTotal(data.count)
      setShowPage(data.page + 1)
      setIsLoad(false)
    }).catch(() => {
      setIsLoad(false)
    })
  }

  // 页码信息变化触发
  useEffect(() => {
    if (isInit && unInitData === true) return
    const keys = Object.keys(listParams)
    const obj = listParams
    keys.forEach((item) => {
      if (obj[item] === undefined || obj[item] === null || obj[item] === '') {
        delete obj[item]
      }
    })
    const params = {
      ...filterProps,
      ...listParams,
    }
    const cloneParams = _.cloneDeep(params)
    const result = processData(cloneParams, searchList)

    getData(result)
    // eslint-disable-next-line
  }, [listParams])

  // 点击翻页
  const onChange = (
    data: PaginationConfig,
    filters: StoreValue,
    sorter: StoreValue
  ): void => {
    const { current = 0, pageSize = 10 } = data
    const desc = (): boolean | undefined => {
      if (sorter.order === 'ascend') return false
      if (sorter.order === 'descend') return true
      return undefined
    }
    // 更新size的时候清空勾选数据
    if (pageSize !== listParams.size && patchClearSelect) {
      patchClearSelect()
    }
    const sortFieldName = desc()
    const params = {
      ...filters,
      ...listParams,
      page: current - 1,
      size: pageSize,
      sortFieldName: sorter.columnKey,
      desc: sortFieldName,
    }
    if (sortFieldName === undefined) {
      delete params.sortFieldName
    }
    saveStoreData(params)
    setlistParams(params)
  }

  // 点击搜索按钮
  const onSearch = (val: AnyProps): void => {
    const { size, sortFieldName, desc } = listParams
    if (patchClearSelect) {
      patchClearSelect()
    }
    const params = {
      size,
      sortFieldName,
      desc,
      ...val,
      page: 0,
    } as ListParams
    if (tabData) {
      params[tabData.key] = tabFilter === 'UNDEFINED' ? undefined : tabFilter
    }

    saveStoreData(params)

    Object.entries(val).forEach((item) => {
      const objKey = item[0]
      const objValue = item[1]
      if (objValue === undefined) {
        delete params[objKey]
      }
    })
    setlistParams(processData(params, searchList))
  }

  // 暴露出去的组件外调用方法
  useImperativeHandle(ref, () => ({
    updata(val: boolean, data?: object): void {
      setisInit(false)
      const { size } = listParams
      if (val) {
        const obj = {
          ...listParams,
          ...data,
          size,
          page: 0
        } as ListParams
        setlistParams(obj)
      } else {
        const obj = {
          ...data,
          size,
          page: 0
        } as ListParams
        setlistParams(obj)
      }
    },
    getList<T>(): T[] {
      return listData
    },
    // 在列表执行存储表单请求数据状态存储在redux操作
    setSearchParamsInTable(val): void {
      const params: Store = {
        ...resultData,
        ...val
      }
      saveStoreData(params)
    },
    // 修改单条数据状态
    updataItem(data: object, index: number): void {
      const newList = [...listData]
      newList[index] = { ...listData[index], ...data }
      setListData(newList)
    },
    // 批量修改数据状态(list:<修改数据的id集合>,params:<修改的属性>)
    patchProps(idList, params): void {
      const arr: StoreValue[] = []
      listData.forEach((item, index) => {
        arr[index] = item
        idList.forEach((ele) => {
          if (item.id === ele) {
            arr[index] = {
              ...item,
              ...params
            }
          }
        })
      })
      setListData(arr)
    },
    // 删除单条数据
    deleteItem(id: string | number): void {
      const newList = listData.filter((item): boolean => item.id !== id)
      if (newList.length === 0) {
        getData(listParams)
      } else {
        setListData(newList)
      }
    },
    // 批量删除元素
    deleteList(idList): void {
      const list = listData
      idList.forEach((id) => {
        const index = listData.findIndex((item) => id === item.id)
        if (index !== -1) {
          listData.splice(index, 1)
        }
      })
      if (list.length === 0) {
        getData(listParams)
      }
      setListData([...list])
    }
  }))

  const proTableProps = {
    ...tableProps,
    dataSource: listData
  }


  useEffect(() => {
    if (tabValueChange) {
      tabValueChange(tabFilter)
    }
  }, [tabFilter, tabValueChange])

  // 内部tab筛选器
  const tabView = (): ReactElement | null => {
    if (tabData) {
      return (
        <Radio.Group
          onChange={(val): void => {
            setTabFilter(val.target.value)
            const obj: ListParams = { ...listParams }
            obj[tabData.key] = val.target.value === 'UNDEFINED'
              ? undefined
              : val.target.value
            obj.page = 0
            saveStoreData({ ...obj })
            setlistParams({ ...obj })
          }}
          value={tabFilter}
        >
          {
            tabData.list.map((item) => (
              <Radio.Button
                key={item.key}
                value={item.key}
              >
                {item.name}
              </Radio.Button>
            ))
          }
        </Radio.Group>
      )
    }
    return null
  }

  const orderTitle: ColumnsType = [
    {
      title: '序号',
      width: 80,
      align: 'center',
      render: (value, record, index): ReactElement => {
        const params = {
          value,
          record,
          index
        }
        return <div>{(params.index + 1) + (listParams.page || 0) * (listParams.size || 10)}</div>
      }
    },
  ]
  const columsObj = [...orderTitle, ...columns]

  const [headerHeight, setHeaderHeight] = useState(0)
  const headerEle = useCallback(
    (node) => {
      if (node !== null) {
        const { height } = node.getBoundingClientRect()
        setHeaderHeight(height)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className={style.tableContainer}>
      <div ref={headerEle}>
        {
          searchList && (
            <SearchForm
              overrideSearchParams={overrideSearchParams}
              searchList={searchList}
              onSearch={onSearch}
              headerBtnGroup={headerBtnGroup}
            />
          )
        }
        {
          // 外部传入的位于table和searchForm之间需要放置的元素
          (filterElement || tabData) && (
            <div className={style.filterProps}>
              {tabView()}
              {filterElement}
            </div>
          )
        }
      </div>
      <Table
        rowKey="id"
        pagination={tablePaginationConfig}
        onChange={onChange}
        {...proTableProps}
        loading={isLoad}
        columns={columsObj}
        scroll={{
          x: scrollX + 80,
          y: window.innerHeight - (233 + headerHeight)
        }}
      />
      {
        // 显示勾选条数
        selectdCount !== undefined && (
          <div className={style.selectCount}>
            <span>已勾选</span>
            <span>
              &nbsp;
              {selectdCount}
              &nbsp;
            </span>
            <span>条</span>
          </div>
        )
      }
    </div>
  )
}

// redux配置
const mapStateToProps = (state: {
  searchReducer: SearchModal
}): SearchModal => state.searchReducer

export interface MapDispatchToProps {
  setSearchParams: (searchParams: Store) => void;
}

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchToProps => ({
  setSearchParams(searchParams: Store): void {
    dispatch(setSearchParams(searchParams))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true },
)(forwardRef(ProTable))
