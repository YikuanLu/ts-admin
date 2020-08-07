import React, {
  forwardRef,
  RefForwardingComponent,
  useImperativeHandle,
  // useState
} from 'react'
import { Form, InputNumber, DatePicker } from 'antd'

import { Store, StoreValue } from 'antd/lib/form/interface'
import moment from 'moment'
import AddTableData from '@/components/main/common/addTableData'

const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
}

export interface ModalEditProps {
  formData?: Store
}

export interface ModalEditHandles {
  submitForm: () => Promise<Store>
}

type RefTable = RefForwardingComponent<ModalEditHandles, ModalEditProps>

const disabledDate = (
  current: StoreValue
): boolean => (current && moment().isAfter(moment(current), 'day'))

const EditRecommendGame: RefTable = (
  { formData }: ModalEditProps,
  ref: React.Ref<ModalEditHandles>
) => {
  const [form] = Form.useForm()
  if (formData) {
    const matchObj = {
      chatRoomId: formData.schedule.chatRoomId,
      guestTeamId: formData.schedule.guestTeamId,
      guestTeamLogo: formData.schedule.guestTeamLogo,
      guestTeamName: formData.schedule.guestTeamName,
      guestTeamScore: formData.schedule.guestTeamScore,
      homeTeamId: formData.schedule.homeTeamId,
      homeTeamLogo: formData.schedule.homeTeamLogo,
      homeTeamName: formData.schedule.homeTeamName,
      homeTeamScore: formData.schedule.homeTeamScore,
      id: formData.schedule.id,
      liveType: formData.schedule.liveType,
      matchEnglishName: formData.schedule.matchEnglishName,
      matchEnglishShortName: formData.schedule.matchEnglishShortName,
      matchId: formData.schedule.matchId,
      matchLogo: formData.schedule.matchLogo,
      matchName: formData.schedule.matchName,
      matchShortName: formData.schedule.matchShortName,
      name: formData.schedule.name,
      progressStatus: formData.schedule.progressStatus,
      realStartTime: formData.schedule.realStartTime,
      seasonId: formData.schedule.seasonId,
      seasonName: formData.schedule.seasonName,
      seasonShowName: formData.schedule.seasonShowName,
      stage: formData.schedule.stage,
      startTime: formData.schedule.startTime,
      status: formData.schedule.status,
      statusName: formData.schedule.statusName,
      type: formData.schedule.type,
      venue: formData.schedule.venue,
    }
    const obj = {
      match: [matchObj],
      time: [moment(formData.startTime), moment(formData.endTime)],
      sort: formData.sort === 0 ? null : formData.sort,
      enable: formData.enable.toString(),
    }
    form.setFieldsValue({ ...obj })
  }
  useImperativeHandle(ref, () => ({
    async submitForm(): Promise<Store> {
      const res = await form.validateFields()
      return res
    }
  }))

  return (
    <div style={{
      marginTop: '20px'
    }}
    >
      <Form
        {...formItemLayout}
        form={form}
        initialValues={{
          enable: 'false',
        }}
      >
        <Form.Item
          label="添加比赛"
          name="match"
          rules={[{
            validateTrigger: ['onSubmig'],
            required: true,
            validator: (_, value): Promise<void> =>
              new Promise((resolve, reject) => {
                if (value.length > 0) {
                  resolve()
                } else {
                  reject('请选择比赛')
                }
              })
          }]}
        >
          <AddTableData
            rangePickerFormat="YYYY-MM-DD"
            initData={[moment(), moment().add(7, 'day')]}
          />
        </Form.Item>
        <Form.Item
          label="有效期"
          name="time"
          rules={[
            {
              required: true,
              message: '请选择有效期',
            },
          ]}
        >
          <RangePicker disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item
          label="排序值"
          name="sort"
        >
          <InputNumber
            min={1}
            step={1}
          />
        </Form.Item>
      </Form>
    </div>
  )
}

export default forwardRef(EditRecommendGame)
