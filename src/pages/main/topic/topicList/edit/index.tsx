import React, { FC, useEffect, useState } from 'react'
import { Form, Input, Select, Button, InputNumber, Radio, message } from 'antd'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import ProUpload from '@/components/common/upload'
import { getSectionGroupList, saveTopic, getTopicDetail } from '@/api/main/topic'
import { SectionItem } from '../../sectionList/types'
import { SelectItem } from '@/components/common/table/types'
import style from '../style.module.sass'
import { getParamObj } from '@/utils/commonFn'
import { EditTopicInfo } from '../types'
import { getOssUrl } from '@/config/publicConfig'

const { Option } = Select
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
const TopicEdit: FC = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const { type } = useParams()
  const { search } = useLocation()
  const [selectList, setSelectList] = useState<SelectItem[]>([])
  const searchSection = (name?: string): void => {
    getSectionGroupList({ name, enabled: 'true' }).then((res): void => {
      const { content = [] } = res.data
      const arr = content.map(
        ((item: SectionItem): SelectItem => (
          { name: item.name, key: item.id }
        ))
      )
      setSelectList(arr)
    })
  }
  const goBack = (): void => {
    history.replace('/topic')
  }
  const toSave = (): void => {
    const { id } = getParamObj(search)
    form.validateFields().then((value): void => {
      const reg = new RegExp(`${getOssUrl()}/`, 'g')
      const obj = {
        ...value,
        cover: value.cover.replace(reg, ''),
        icon: value.icon.replace(reg, '')
      }
      saveTopic({ id, ...obj }).then((): void => {
        if (type === 'create') {
          message.success('话题创建成功')
          goBack()
        } else {
          message.success('话题保存成功')
          goBack()
        }
      })
    })
  }

  useEffect((): void => {
    searchSection()
    const { id } = getParamObj(search)
    if (id && type === 'edit') {
      getTopicDetail({ id }).then((res) => {
        const { data } = res
        const detail = data as EditTopicInfo
        const initData = {
          ...data,
          sort: detail.sort || null
        }
        const hasItem = selectList.find((item: SelectItem): boolean =>
          item.key === detail.groupId)
        if (!hasItem) {
          setSelectList([{ name: detail.groupName, key: detail.groupId }, ...selectList])
        } else {
          setSelectList([...selectList])
        }
        form.setFieldsValue(initData)
      })
    } else if (type === 'edit') {
      history.replace('/userInfo/list')
    } else {
      form.setFieldsValue({ sex: 'UNKNOWN' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <Form
        form={form}
        {...formItemLayout}
        initialValues={{ recommended: false }}
      >
        <Form.Item
          label="话题图标"
          name="icon"
          rules={[
            {
              required: true,
              message: '请上传400*400以内，长宽等比的图形文件',
              validateTrigger: ['onBlur']
            },
          ]}
        >
          <ProUpload
            uploadType="image"
            showText="建议尺寸400*400"
          />
        </Form.Item>
        <Form.Item
          label="话题名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入话题名称',
            },
          ]}
        >
          <Input placeholder="话题名称,长度最长不超过10" maxLength={10} />
        </Form.Item>
        <Form.Item
          label="所属版块"
          name="groupId"
          rules={[
            {
              required: true,
              message: '请选择所属版块',
            },
          ]}
        >
          <Select
            placeholder="请选择所属模块"
            showSearch
            onSearch={searchSection}
            allowClear
            filterOption={false}
            onChange={(values: string): void => {
              if (values === undefined) { searchSection() }
            }}
          >
            {
              selectList.map((item: SelectItem): React.ReactElement => {
                const { key, name } = item
                return (
                  <Option key={key} value={key}>{name}</Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label="话题封面"
          name="cover"
          rules={[
            {
              required: true,
              message: '请上传720*540以内，长宽等比的图形文件',
              validateTrigger: ['onBlur']
            },
          ]}
        >
          <ProUpload
            aspect={16 / 9}
            uploadType="image"
            showText="建议尺寸16/9"
          />
        </Form.Item>
        <Form.Item
          label="排序值"
          name="sort"
        >
          <InputNumber min={1} precision={0} />
        </Form.Item>
        <Form.Item
          label="是否推荐"
          name="recommended"
        >
          <Radio.Group>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <div className={style.btns}>
        <Button onClick={goBack}>取消</Button>
        <Button
          type="primary"
          style={{ marginLeft: '15px' }}
          onClick={toSave}
        >
          {type === 'create' ? '创建话题' : '保存'}
        </Button>
      </div>
    </div>
  )
}

export default TopicEdit
