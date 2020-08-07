import React, { FC, ReactElement, useEffect } from 'react'
import Moment from 'moment'
import { Form, Input, Select, DatePicker, Button } from 'antd'
import style from './style.module.sass'
import { SearchItem, SelectItem, AnyProps } from './types'
import { StoreValue } from '@/global'

const { Option } = Select
const { RangePicker } = DatePicker

interface SearchFormProps {
  onSearch: (val: AnyProps) => void, // 触发搜索回调
  searchList: SearchItem[],
  filterParams?: object
}

const createRangePickerKeys = (data: SearchItem): React.ReactElement => {
  const { type, rangeDateKey, disabledTime = {}, rangePickerFormat } = data
  const { minTime, maxTime } = disabledTime
  const disabledDate = (current: StoreValue): boolean => {
    // Can not select days before today and today
    if (minTime && maxTime) {
      return current
        && current < maxTime.endOf('day')
        && current > minTime.endOf('day')
    }
    if (maxTime) {
      return current
        && current > maxTime.endOf('day')
    }
    if (minTime) {
      return current
        && current < minTime.endOf('day')
    }
    return false
  }

  if (type === 'rangePicker' && rangeDateKey === undefined) {
    throw Error('请传入<rangeDateKey>属性')
  }
  return (
    <RangePicker
      disabledDate={disabledDate}
      format={rangePickerFormat}
      showTime={rangePickerFormat?.includes('HH')}
    />
  )
}

const createSelectOption = (data: SelectItem[]): React.ReactElement[] => data.map((item, index) => {
  const key = item.key + index
  return (
    <Option value={item.key} key={key}>{item.name}</Option>
  )
})

const createSelect = (data: SearchItem, selectList: SelectItem[]): ReactElement => {
  const {
    disable,
    name,
    onChange,
    isFilter,
    onSearch,
  } = data
  return (
    <Select
      disabled={disable === true}
      placeholder={name}
      filterOption={isFilter
        ? (input, option): boolean => {
          if (option) {
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          return false
        } : false}
      onChange={onChange}
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

const SearchForm: FC<SearchFormProps> = (props: SearchFormProps) => {
  const [form] = Form.useForm()
  const {
    onSearch,
    searchList,
    filterParams
  } = props
  // 表单提交事件
  const onFinish = (): void => {
    const val = form.getFieldsValue()
    const result: AnyProps = {
      ...val,
      ...filterParams
    }
    const keys = Object.keys(result)
    keys.map((item) => {
      // 干掉对象里值为undefined的属性
      if (!result[item]) {
        delete result[item]
      }
      // 转换时间格式
      if (result[item] instanceof Moment) {
        result[item] = Moment(result[item]).format('YYYY-MM-DD HH:mm:ss')
      }
      // 处理表单为<开始时间｜结束时间>的属性的字段名
      if (result[item] instanceof Array) {
        const defaultRangePickerMap = {
          rangeDateKey: {
            startTime: 'startTime',
            endTime: 'endTime'
          }
        }
        const rangePickerMap = searchList.find((ele) => ele.key === item) || defaultRangePickerMap
        const startKey = rangePickerMap.rangeDateKey
          ? rangePickerMap.rangeDateKey.startTime
          : ''
        const endKey = rangePickerMap.rangeDateKey
          ? rangePickerMap.rangeDateKey.endTime
          : ''
        result[startKey] = `${Moment(result[item][0]).format('YYYY-MM-DD')} 00:00:00`
        result[endKey] = `${Moment(result[item][1]).format('YYYY-MM-DD')} 23:59:59`
        delete result[item]
      }
      return item
    })
    onSearch(result)
  }
  const createSearchItem = (data: SearchItem): React.ReactElement => {
    const { selectList = [] } = data
    // const { selectList = [], key } = data
    switch (data.type) {
      case 'input':
        return (
          <Input
            allowClear
            placeholder={data.name}
          />
        )
      case 'select':
        return createSelect(data, selectList)
      case 'rangePicker': {
        return createRangePickerKeys(data)
      }
      case 'datePicker':
        return (
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{ format: 'HH:mm' }}
          />
        )
      default:
        return (
          <Input />
        )
    }
  }
  useEffect((): void => {
    // eslint-disable-next-line array-callback-return
    searchList.map((item: SearchItem): void => {
      const { key, initData } = item
      if (item.type === 'rangePicker') {
        const obj = {}
        obj[key] = initData
        form.setFieldsValue(obj)
      }
    })
  }, [form, searchList])
  return (
    <div className={style.searchForm}>
      <Form
        labelAlign="left"
        labelCol={{
          span: 4
        }}
        wrapperCol={{
          span: 18
        }}
        form={form}
        layout="inline"
        colon={false}
        onKeyUp={(e): void => {
          if (e.keyCode === 13) {
            onFinish()
          }
        }}
      >
        {
          searchList.map((item) => (
            (
              <Form.Item
                className={item.type === 'rangePicker' ? style.dateItem : style.formItem}
                label={item.name}
                labelAlign="left"
                name={item.key}
                key={item.key}
              >
                {
                  createSearchItem(item)
                }
              </Form.Item>
            )
          ))
        }

        <div className={style.formItem}>
          <Button
            type="primary"
            style={{
              marginRight: '10px'
            }}
            onClick={(): void => {
              onFinish()
            }}
          >
            搜索
          </Button>
          <Button
            type="default"
            onClick={(): void => {
              form.resetFields()
            }}
          >
            清空
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default SearchForm
