import React, { FC, useEffect, useState } from 'react'

import { Form, Input, Radio, DatePicker, Cascader, Button, Col, Row, message } from 'antd'
import { useLocation, useHistory, useParams } from 'react-router-dom'
import moment from 'moment'
import { StoreValue } from 'antd/lib/form/interface'
import ProUpload from '@/components/common/upload'
import { store } from '@/store'
import { AreaItem } from '@/models/common'
import { getUserDetail, addUser, changeUserInfo } from '@/api/user'
import { getParamObj } from '@/utils/commonFn'
import style from '../style.module.sass'

const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    lg: { span: 2 },
    md: { span: 24 }
  },
  wrapperCol: {
    lg: { span: 12 },
    md: { span: 15 }
  }
}
// interface UserInfo {
//   avatar: string;
//   birthDay: string;
//   mobile: string;
//   nickName: string;
//   provinceCode?: string;
//   provinceName?: string;
//   regionCode?: string;
//   regionName?: string;
//   cityCode?: string;
//   cityName?: string;
//   sex: string;
//   sign?: string
// }

interface DetailInfo { avatar: string, avatarUrl: string }

const UserInfoItem: FC = () => {
  const { search } = useLocation()
  const [area, setArea] = useState<AreaItem[]>([])
  const [option, setOption] = useState<AreaItem[]>([])
  const [detail, setDetail] = useState<DetailInfo>({
    avatar: '',
    avatarUrl: ''
  })
  const [pageType, savePageType] = useState<string>('create')
  const [form] = Form.useForm()
  const history = useHistory()
  const { type } = useParams()
  useEffect(() => {
    const { id } = getParamObj(search)
    const { areaList } = store.getState().commonReducer
    savePageType(type)
    setArea(areaList)
    if (id && type === 'edit') {
      getUserDetail({ id }).then((res) => {
        const { data } = res
        setDetail(data as DetailInfo)
        const initData = {
          ...data,
          avatar: data.avatarUrl,
          birthDay: data.birthDay ? moment(data.birthDay) : null,
          area: [data.provinceCode, data.regionCode, data.cityCode]
        }
        form.setFieldsValue(initData)
      })
    } else if (type === 'edit') {
      history.replace('/userInfo/list')
    } else {
      form.setFieldsValue({ sex: 'UNKNOWN' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])
  useEffect((): void => {
    if (area.length > 0) {
      setOption(area)
    }
  }, [area])

  // 从地区树中摘取后端需要的信息
  const getList = (data: string[], areaList: AreaItem[], newlist: AreaItem[]): AreaItem[] => {
    if (!data || data.length < 1 || areaList.length < 1) {
      return newlist
    }
    const finalList = newlist
    const FieldData = [...data]
    const num = FieldData.slice(0, 1)
    const newArea: AreaItem = areaList.find(
      (items: AreaItem): boolean =>
        items.value === num[0]) || {} as AreaItem
    const { value = '', label = '', children = [] } = newArea
    finalList[3 - FieldData.length] = {
      value,
      label
    }
    return getList(FieldData.splice(1, FieldData.length), children, finalList)
  }


  const goBack = (): void => {
    history.replace('/userInfo')
  }

  // useEffect((): boolean => (): boolean => false, [])
  const toCreated = (): void => {
    const { id } = getParamObj(search)
    form.validateFields().then((value): void => {
      // const fieldData
      const [provinceData, regionData, cityData] = getList(
        value.area, area,
        [
          { value: '', label: '' },
          { value: '', label: '' },
          { value: '', label: '' }
        ]
      )
      const { avatarUrl, avatar } = detail
      const uploadData = {
        ...value,
        avatar: avatarUrl.includes(value.avatar) ? avatar : value.avatar,
        birthDay: value.birthDay ? value.birthDay.format('YYYY-MM-DD HH:mm:ss') : null,
        provinceCode: provinceData.value === '' ? null : provinceData.value,
        provinceName: provinceData.label === '' ? null : provinceData.label,
        cityCode: cityData.value === '' ? null : cityData.value,
        cityName: cityData.label === '' ? null : cityData.label,
        regionCode: regionData.value === '' ? null : regionData.value,
        regionName: regionData.label === '' ? null : regionData.label,
      }
      if (pageType === 'create') {
        addUser([uploadData]).then((): void => {
          message.success('用户创建成功')
          goBack()
        })
      } else {
        changeUserInfo({ ...uploadData, userId: id }).then((): void => {
          message.success('用户保存成功')
          goBack()
        })
      }
    })
  }

  const disabledDate = (current: StoreValue): boolean =>
    // Can not select days before today and today
    current && current > moment().endOf('day')


  return (
    <div>
      <Form
        form={form}
        {...formItemLayout}
      >
        <Form.Item
          label="头像"
          name="avatar"
          rules={[
            {
              required: true,
              message: '请上传头像',
              validateTrigger: ['onBlur']
            },
          ]}
        >
          <ProUpload imageSize={2 * 1024 * 1024} uploadType="image" showText="上传头像" />
        </Form.Item>
        <Form.Item
          label="昵称"
          name="nickName"
          rules={[
            {
              required: true,
              message: '昵称不能为空噢~'
            },
            {
              validator: (_, value): Promise<void> => {
                if (!value || (value.length > 1 && value.length < 13)) {
                  return Promise.resolve()
                }
                if (value.length < 4) {
                  return Promise.reject('昵称最少要2个字符噢~')
                }
                return Promise.reject('昵称需要在2-12个字符以内噢~')
              }
            }
          ]}
        >
          <Input placeholder="2-12个字符,支持中英文、数字、特殊字符" />
        </Form.Item>

        <Form.Item label="签名" name="sign">
          <TextArea placeholder="最多40个中文" maxLength={40} />
        </Form.Item>
        <Form.Item
          label="手机"
          name="mobile"
          rules={[
            {
              required: true,
              message: '手机号格式不正确',
            },
            {
              validator: (_, value): Promise<void> => {
                const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
                if (!value || myreg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject('手机号格式不正确')
              }
            }
          ]}
        >
          <Input maxLength={11} placeholder="11位手机号" />
        </Form.Item>
        <Form.Item label="性别" name="sex">
          <Radio.Group>
            <Radio value="UNKNOWN">保密</Radio>
            <Radio value="MAN">男</Radio>
            <Radio value="WOMAN">女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="生日" name="birthDay">
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item label="所在地" name="area">
          <Cascader
            showSearch
            options={option}
          />
        </Form.Item>
      </Form>
      <Row>
        <Col span={2} />
        <Col span={15}>
          <p className={style.close}>(UID：根据系统自动生成8位唯一序列号)</p>
        </Col>
      </Row>
      <div className={style.btns}>
        <Button onClick={goBack}>取消</Button>
        <Button
          type="primary"
          style={{ marginLeft: '15px' }}
          onClick={toCreated}
        >
          {pageType === 'create' ? '创建用户' : '保存'}
        </Button>
      </div>
    </div>
  )
}

export default UserInfoItem
