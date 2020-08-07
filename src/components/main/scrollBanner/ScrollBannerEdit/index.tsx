import React, { useState, useImperativeHandle, RefForwardingComponent, forwardRef } from 'react'
import { Form, Input, Select, DatePicker, InputNumber, Radio } from 'antd'
import { Store, StoreValue } from 'antd/lib/form/interface'
import moment from 'moment'
import ProUpload from '@/components/common/upload'
import BannerPreview from '../BannerPreview'
import { defaultFormData } from './data'
import { ScrollBannerFormProps } from './type'

import AddMatchList from '../../common/addTableData'
import AddArticleTableData from '../../common/addArticleTableData'

const { RangePicker } = DatePicker
const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}

export interface ModalEditProps {
  initData?: Store
}
export interface ModalEditHandles {
  submitForm: () => Promise<Store>
  resetForm: () => void
}
type RefModal = RefForwardingComponent<ModalEditHandles, ModalEditProps>

const ScrollBannerEdit: RefModal = (props, ref) => {
  const { initData = {} } = props
  const [form] = Form.useForm()
  const [formData, saveFormData] = useState<ScrollBannerFormProps>(defaultFormData)
  useImperativeHandle(ref, () => ({
    async submitForm(): Promise<Store> {
      const res = await form.validateFields()
      return res
    },
    resetForm(): void {
      form.resetFields()
    }
  }))


  const disabledDate = (current: StoreValue): boolean =>
    // Can not select days before today and today
    current && moment().isAfter(moment(current), 'day')


  // const disabledDateTime = (datas: StoreValue): {} => {
  //   let Hour = Array.from({ length: moment().hour() }, (_, k) => k)
  //   let Minute = Array.from({ length: moment().minute() }, (_, k) => k)
  //   if (datas && moment().isBefore(moment(datas), 'day')) {
  //     Hour = []
  //     Minute = []
  //   }
  //   return {
  //     disabledHours: (): number[] => [],
  //     disabledMinutes: (): number[] => []
  //   }
  // }

  return (
    <Form
      form={form}
      {...formItemLayout}
      labelAlign="right"
      initialValues={{
        type: 'ARTICLE',
        enable: false,
        ...initData
      }}
      onValuesChange={(_, allValues): void => {
        saveFormData(allValues as ScrollBannerFormProps)
      }}
    >
      <Form.Item
        label="轮播图"
      >
        <Form.Item
          name="image"
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          rules={[{ required: true, message: '请上传比例为16*9的轮播图' }]}
        >
          <ProUpload aspect={16 / 9} showText="请上传比例为16*9的轮播图" />
        </Form.Item>
        <BannerPreview img={formData.image} showText={formData.title} />
      </Form.Item>
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input
          maxLength={40}
          style={{ width: 'calc(50% - 8px)' }}
          placeholder="请输入标题"
        />
      </Form.Item>
      <Form.Item
        label="链接"
        style={{ marginBottom: '24px' }}
      >
        <Form.Item
          name="type"
          style={{ width: 'calc(50% - 8px)' }}
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <Select>
            <Option value="ARTICLE">文章</Option>
            <Option value="MATCH">比赛</Option>
            <Option value="CUSTOM">自定义</Option>
          </Select>
        </Form.Item>
        {formData.type === 'ARTICLE' && (
          <Form.Item
            name="businessArticleId"
            style={{
              marginBottom: '0',
            }}
            rules={[{ required: true, message: '请选择' }]}
          >
            <AddArticleTableData />
          </Form.Item>
        )}
        {formData.type === 'MATCH' && (
          <Form.Item
            name="businessId"
            style={{
              marginBottom: '0',
            }}
            rules={[{ required: true, message: '请选择' }]}
          >
            <AddMatchList
              rangePickerFormat="YYYY-MM-DD"
              initData={[moment(), moment().add(7, 'day')]}
            />
          </Form.Item>
        )}
        {formData.type === 'CUSTOM' && (
          <Form.Item
            name="link"
            style={{
              marginBottom: '0',
            }}
            rules={[{ max: 255, required: true, message: '请输入正确的地址(255个字符以内)' }]}
          >
            <Input />
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item
        label="上架时间"
        name="time"
        rules={[{ required: true, message: '请选择上架时间' }]}
      >
        <RangePicker
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={disabledDate}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }}
        // disabledTime={(data): {
        //   [PropsName: string]: number[]
        // } => disabledDateTime(data)}
        />
      </Form.Item>
      <Form.Item
        label="排序值"
        name="sort"
      >
        <InputNumber min={0} precision={0} />
      </Form.Item>
      <Form.Item
        label="状态"
        name="enable"
        style={{ opacity: 0, height: 0 }}
      >
        <Radio.Group disabled>
          <Radio value>启用</Radio>
          <Radio value={false}>禁用</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  )
}

export default forwardRef(ScrollBannerEdit)
