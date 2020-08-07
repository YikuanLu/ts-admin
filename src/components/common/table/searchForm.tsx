import React, { FC, ReactElement, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { useHistory } from 'react-router-dom'
import Moment from 'moment'
import { Form, Input, Select, InputNumber, DatePicker, Button, Row, Col } from 'antd'
import { Store } from '@/global'
import style from './searchFormStyle.module.sass'
import { SearchItem, SelectItem, AnyProps, SearchFormProps } from './types'

import { SearchModal } from '@/models/search'
import { setSearchParams } from '@/store/actions/search'

const { Option } = Select
const { RangePicker } = DatePicker

const createRangePickerKeys = (data: SearchItem): React.ReactElement => {
  const { type, rangeDateKey, showTime } = data
  if (type === 'rangePicker' && rangeDateKey === undefined) {
    throw Error('请传入<rangeDateKey>属性')
  }
  return (
    <RangePicker
      showTime={showTime}
      style={{
        width: '100%'
      }}
      format={showTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'}
    />
  )
}

const createSelectOption = (data: SelectItem[]): React.ReactElement[] =>
  data.map((item) => {
    const { key } = item
    return (
      <Option value={item.key} key={key}>{item.name}</Option>
    )
  })

const createSelect = (
  data: SearchItem,
  selectList: SelectItem[]
): ReactElement => {
  const {
    disable,
    name,
    isFilter,
    onChange,
    onSearch
  } = data
  return (
    <Select
      disabled={disable === true}
      placeholder={name}
      filterOption={isFilter
        ? (input, option): boolean => {
          const isOption = option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          return option ? isOption : false
        } : false}
      onChange={(val): void => {
        onChange?.(val)
        if (val === undefined) {
          onSearch?.(val)
        }
      }}
      showSearch={!!onSearch === true ? true : undefined}
      onSearch={onSearch}
      allowClear
    >
      {
        createSelectOption(selectList)
      }
    </Select>
  )
}

const createSearchItem = (data: SearchItem): React.ReactElement => {
  const { selectList = [] } = data
  switch (data.type) {
    case 'input':
      return (
        <Input
          allowClear
          placeholder={data.name}
        />
      )
    case 'number':
      return (
        <InputNumber
          placeholder={data.name}
          style={{ width: '100%' }}
          min={0}
          type="number"
          precision={0}
        />
      )
    case 'select':
      return createSelect(data, selectList)
    case 'rangePicker':
      return createRangePickerKeys(data)
    case 'datePicker':
      return (
        <DatePicker
          style={{
            width: '100%'
          }}
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ format: 'HH:mm:ss' }}
        />
      )
    case 'dayePicker':
      return (
        <DatePicker
          style={{
            width: '100%'
          }}
          format="YYYY-MM-DD"
        />
      )
    default:
      return (
        <Input />
      )
  }
}

const formStyle = {
  labelCol: {
    xl: 6,
    lg: 24
  },
  wrapperCol: {
    xl: 18,
    lg: 24
  }
}

const defaultSize = window.innerWidth <= 1200

const SearchFormUi: FC<SearchFormProps> = (props: SearchFormProps) => {
  const [form] = Form.useForm()
  const history = useHistory()
  const {
    onSearch,
    searchList,
    searchParams,
    headerBtnGroup,
    overrideSearchParams,
  } = props

  useEffect(() => {
    const key = history.location.pathname
    const curObj = {
      ...searchParams?.[key],
      ...overrideSearchParams
    }
    if (curObj) {
      Object.entries(curObj).forEach((item: Store) => {
        if (item[1] instanceof Array) {
          const arr = item[1].map((ele) => Moment(ele))
          curObj[item[0]] = arr
        }
      })
    }
    form.setFieldsValue(curObj)
  }, [form, history.location, overrideSearchParams, searchParams])

  // 表单提交事件
  const onFinish = (): void => {
    const val = form.getFieldsValue()
    const result: AnyProps = {
      ...val,
    }
    onSearch({
      ...result,
    })
  }

  // 表单清空事件
  const onClear = (): void => {
    form.resetFields()
  }
  const [isXl, setIsXl] = useState<boolean>(defaultSize)
  const handleResize = (event: Store): void => {
    if (event.currentTarget.innerWidth >= 1200) {
      setIsXl(false)
    } else {
      setIsXl(true)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={style.searchForm}>
      {
        headerBtnGroup && (
          <div className={style.headerBtnGroup}>
            {headerBtnGroup}
          </div>
        )
      }
      <Form
        {...formStyle}
        labelAlign="right"
        form={form}
        layout={isXl ? 'vertical' : 'inline'}
        colon={false}
        onKeyUp={(e): void => {
          if (e.keyCode === 13) {
            onFinish()
          }
        }}
      >
        <Row
          style={{
            width: '100%'
          }}
          gutter={[16, 16]}
        >
          {
            searchList.map((item) => (
              (
                <Col
                  span={6}
                  key={item.key}
                >
                  <Form.Item
                    className={style.formItem}
                    label={item.name}
                    name={item.key}
                  >
                    {
                      createSearchItem(item)
                    }
                  </Form.Item>
                </Col>
              )
            ))
          }
        </Row>

        {searchList.length > 0
          && (
            <div className={style.btnGroup}>
              <Button
                type="primary"
                style={{
                  marginRight: '10px'
                }}
                onClick={(): void => {
                  // 清空路径上的参数
                  history.push(history.location.pathname)
                  onFinish()
                }}
              >
                搜索
              </Button>
              <Button
                type="default"
                onClick={onClear}
              >
                清空
              </Button>
            </div>
          )}
      </Form>
    </div>
  )
}

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
)(SearchFormUi)
