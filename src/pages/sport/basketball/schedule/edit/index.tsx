import React, {
  forwardRef,
  RefForwardingComponent,
  useImperativeHandle,
  useEffect,
  useState,
} from 'react'

import { Form, Select, DatePicker, Input, InputNumber } from 'antd'
import { Store } from 'antd/lib/form/interface'
import moment from 'moment'
import {
  BastetballScheduleItem,
  BasketballMatchItem,
  BasketballTeamItem
} from '@/pages/sport/basketball/types'

import {
  matchStatusSelectList,
} from '@/pages/sport/basketball/typeData'


import {
  getBasketballMatchList,
  getBasketballTeamList,
} from '@/api/sport/basketball'

const { Option } = Select

interface ModalEditProps {
  formData?: BastetballScheduleItem
}

export interface ModalEditHandles {
  submitForm: () => Promise<Store>
}

type RefTable = RefForwardingComponent<ModalEditHandles, ModalEditProps>

const BasketballScheduleEdit: RefTable = (
  { formData }: ModalEditProps,
  ref: React.Ref<ModalEditHandles>
) => {
  const [form] = Form.useForm()
  useImperativeHandle(ref, () => ({
    async submitForm(): Promise<Store> {
      const res = await form.validateFields()
      return res
    }
  }))

  useEffect(() => {
    if (formData) {
      const params = {
        ...formData,
        startTime: moment(formData.startTime),
      }
      form.setFieldsValue(params)
    }
  }, [form, formData])

  const [matchList, setMatchList] = useState([])
  const [homeTeamList, setHomeTeamList] = useState([])
  const [guestTeamList, setGuestTeamList] = useState([])
  useEffect(() => {
    getBasketballMatchList({
      size: 999
    }).then((res): void => {
      const { content = [] } = res.data
      setMatchList(content)
    })
    getBasketballTeamList({
      size: 200
    }).then((res): void => {
      const { content = [] } = res.data
      setHomeTeamList(content)
      setGuestTeamList(content)
    })
  }, [])

  interface TeamSelectConfig {
    showSearch: boolean,
    filterOption: boolean,
    onSearch: (val: string) => void,
    onFocus: () => void,
  }
  const teamSelectConfig = (type: 'HOME' | 'GUEST'): TeamSelectConfig => ({
    showSearch: true,
    filterOption: false,
    onFocus: (): void => {
      getBasketballTeamList({
        size: 200,
      }).then((res): void => {
        const { content = [] } = res.data
        if (type === 'HOME') {
          setHomeTeamList(content)
        } else {
          setGuestTeamList(content)
        }
      })
    },
    onSearch: (val: string): void => {
      getBasketballTeamList({
        size: 200,
        name: val
      }).then((res): void => {
        const { content = [] } = res.data
        if (type === 'HOME') {
          setHomeTeamList(content)
        } else {
          setGuestTeamList(content)
        }
      })
    }
  })

  return (
    <div style={{ marginTop: '50px' }}>
      <Form
        form={form}
      >
        <Form.Item
          label="所属赛事"
          name="matchId"
          rules={[{
            required: true,
            message: '请选择所属赛事'
          }]}
        >
          <Select
            showSearch
            filterOption={false}
            allowClear
            onChange={(val): void => {
              if (val === undefined) {
                getBasketballMatchList({
                  size: 999,
                  name: val
                }).then((res): void => {
                  const { content = [] } = res.data
                  setMatchList(content)
                })
              }
            }}
            onSearch={(val): void => {
              getBasketballMatchList({
                size: 999,
                name: val
              }).then((res): void => {
                const { content = [] } = res.data
                setMatchList(content)
              })
            }}
          >
            {
              matchList.map((item: BasketballMatchItem) => (
                <Option key={item.id} value={item.id}>{item.shortName}</Option>
              ))
            }
          </Select>
        </Form.Item>
        {/* ========================================= */}
        <Form.Item
          label="比赛时间"
          name="startTime"
          rules={[{
            required: true,
            message: '请选择比赛时间'
          }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        {/* ========================================= */}
        <Form.Item
          name="name"
          label="比赛阶段"
          rules={[{
            required: true,
            message: '请选择比赛阶段'
          }]}
        >
          <Input />
        </Form.Item>
        {/* ========================================= */}
        <Form.Item
          name="homeTeamId"
          label="主队名称"
          rules={[{
            required: true,
            message: '请选择主队名称'
          }]}
        >
          <Select
            {...teamSelectConfig('HOME')}
          >
            {
              homeTeamList.map((item: BasketballTeamItem) => (
                <Option key={item.id} value={item.id}>{item.shortName}</Option>
              ))
            }
          </Select>
        </Form.Item>
        {/* ========================================= */}
        <Form.Item
          name="guestTeamId"
          label="客队名称"
          rules={[{
            required: true,
            message: '请选择客队名称'
          }]}
        >
          <Select
            {...teamSelectConfig('GUEST')}
          >
            {
              guestTeamList.map((item: BasketballTeamItem) => (
                <Option key={item.id} value={item.id}>{item.shortName}</Option>
              ))
            }
          </Select>
        </Form.Item>
        {/* ========================================= */}
        <Form.Item
          label="比赛状态"
          required
        >
          <Input.Group compact>
            <Form.Item
              noStyle
              name="status"
              rules={[{
                required: true,
                message: '请选择比赛状态'
              }]}
            >
              <Select style={{ width: '40%' }} placeholder="比赛状态">
                {
                  matchStatusSelectList.map((item) => (
                    <Option key={item.key} value={item.key}>{item.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              name="reason"
              noStyle
            >
              <Input
                maxLength={10}
                style={{ width: '60%' }}
                placeholder="延期/取消原因"
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        {/* ========================================= */}
        <Form.Item
          name="homeTeamScore"
          label="主队得分"
        >
          <InputNumber min={0} step={1} precision={0} />
        </Form.Item>
        {/* ========================================= */}
        <Form.Item
          name="guestTeamScore"
          label="客队得分"
        >
          <InputNumber min={0} step={1} precision={0} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default forwardRef(BasketballScheduleEdit)
