import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  RefForwardingComponent,
  ReactElement
} from 'react'
import { Table, ConfigProvider } from 'antd'
import { TablePaginationConfig, ColumnsType } from 'antd/lib/table/interface'
import { PaginationConfig } from 'antd/lib/pagination/Pagination'
import moment from 'moment'
import 'moment/locale/zh-cn'
import zhCN from 'antd/es/locale/zh_CN'
import { AnyProps, ProTableProps, ListParams, SearchItem } from './types'
import SearchForm from './searchForm'
import style from '@/components/main/article/AddMatchList/style.module.sass'
import { DataProps } from '@/utils/axios'

export interface ProTableHandles {
  updata(val?: boolean, data?: object): void;
  deleteItem(key: string | number): void;
  updataItem(data: object, index: number): void;
  getList<T>(): T[]
}

type RefTable = RefForwardingComponent<ProTableHandles, ProTableProps>

const NormalTable: RefTable = (props: ProTableProps, ref: React.Ref<ProTableHandles>) => {
  const {
    tableProps,
    searchList = [],
    api,
    filterElement,
    scrollX = 1800,
    changePage,
    initSearchData = {}
  } = props
  const { columns = [] } = tableProps
  const [total, setTotal] = useState(0)
  const [initKey, setKey] = useState(true)
  const [showPage, setShowPage] = useState(1)
  const tablePaginationConfig: TablePaginationConfig = {
    current: showPage,
    total,
    showSizeChanger: true,
    pageSizeOptions: ['10', '30', '50', '100'],
    defaultPageSize: 10,
    showTotal: (totalNum) => `共${totalNum}条`
  }
  // const defaultParams: ListParams = {
  //   page: 0,
  //   size: 10,
  // }

  const [isLoad, setIsLoad] = useState(false)
  const [listParams, setlistParams] = useState<ListParams>({
    page: 0,
    size: 10,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listData, setListData] = useState<any[]>([])
  const [filterParams, setfilterParams] = useState<object>({})

  const orderTitle: ColumnsType = [
    {
      title: '序号',
      width: 40,
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
  const cur = useRef({})
  // 请求数据方法
  const getData = (params: ListParams): void => {
    setIsLoad(true)
    api({ ...initSearchData, ...params }).then((res) => {
      const { data } = res
      setListData(data.content)
      setTotal(data.count)
      setShowPage(data.page + 1)
      setIsLoad(false)
    }).catch(() => {
      setIsLoad(false)
    })
  }

  const getSearchInitData = (): { [propsName: string]: string | number } => {
    const params: DataProps = {}
    setKey(false)
    if (!initKey) {
      return params
    }
    // eslint-disable-next-line array-callback-return
    searchList.map((item: SearchItem): void => {
      const { initData, type, rangeDateKey, key } = item
      switch (type) {
        case 'rangePicker':
          if (rangeDateKey && initData) {
            const { startTime, endTime } = rangeDateKey
            const [params1, params2] = initData
            params[startTime] = `${params1.format('YYYY-MM-DD')} 00:00:00`
            params[endTime] = `${params2.format('YYYY-MM-DD')} 23:59:59`
          }
          break

        case 'datePicker':
          if (initData && initData instanceof moment) {
            params[key] = `${moment(initData).format('YYYY-MM-DD')} 23:59:59`
          }
          break

        default:
          if (initData) { params[key] = initData }
          break
      }
    })
    setlistParams({
      ...listParams,
      ...params
    })
    return params
  }

  // 页码信息变化触发
  useEffect(() => {
    const keys = Object.keys(listParams)
    const obj = listParams
    keys.forEach((item) => {
      if (obj[item] === undefined) {
        delete obj[item]
      }
    })
    // if (underscore.isEqual(listParams, cur.current)) return
    cur.current = listParams
    const params = {
      ...listParams,
    }
    const initParams = getSearchInitData()
    getData({
      ...initParams,
      ...params
    })
    if (changePage) {
      changePage(params.page)
    }
    // eslint-disable-next-line
  }, [listParams])

  // 点击翻页
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (data: PaginationConfig, filters: any, sorter: any): void => {
    const { current = 0, pageSize = 10 } = data
    const desc = (): boolean | undefined => {
      if (sorter.order === 'ascend') return false
      if (sorter.order === 'descend') return true
      return undefined
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
    setlistParams(params)
  }

  // 点击搜索按钮
  const onSearch = (val: AnyProps): void => {
    const { size, desc, sortFieldName } = listParams
    setlistParams({
      size,
      page: 0,
      desc,
      sortFieldName,
      ...val,
    } as ListParams)
  }

  useImperativeHandle(ref, () => ({
    updata(val: boolean, data?: object): void {
      const { size } = listParams
      if (data) {
        setfilterParams(data)
      }
      if (val) {
        const obj = {
          ...listParams,
          ...data,
          size,
          page: 0
        } as ListParams
        setlistParams(obj)
        getData(obj)
      } else {
        const obj = {
          ...data,
          size,
          page: 0
        } as ListParams
        setlistParams(obj)
        getData(obj)
      }
    },
    updataItem(data: object, index: number): void {
      const newList = [...listData]
      newList[index] = { ...listData[index], ...data }
      setListData(newList)
    },
    getList<T>(): T[] {
      return listData
    },
    deleteItem(keys: string | number): void {
      const newList = listData.filter((item): boolean => item.id !== keys)
      if (newList.length === 0) {
        getData(listParams)
      } else {
        setListData(newList)
      }
    }
  }))

  const proTableProps = {
    ...tableProps,
    dataSource: listData
  }

  const height = window.innerHeight
  return (
    <ConfigProvider locale={zhCN}>
      {
        searchList && (
          <SearchForm
            filterParams={filterParams}
            searchList={searchList}
            onSearch={onSearch}
          />
        )
      }
      {
        filterElement && (
          <div className={style.filterProps}>
            {filterElement}
          </div>
        )
      }
      <Table
        rowKey="id"
        pagination={tablePaginationConfig}
        onChange={onChange}
        {...proTableProps}
        loading={isLoad}
        columns={columsObj}
        scroll={{
          x: scrollX + 80,
          y: height * 0.4
        }}
      />
    </ConfigProvider>
  )
}


export default forwardRef(NormalTable)
