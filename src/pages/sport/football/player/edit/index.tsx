import React, { FC, useEffect, useState } from 'react'

import { Form, Button, message, Row, Col, Input, Select, InputNumber, Space } from 'antd'
import { useHistory, useParams, useLocation } from 'react-router-dom'

import { uniqWith, isEqual } from 'lodash'
import { getFootballPlayerItem, saveFootballPlayer, getFootballTeamList } from '@/api/sport/football'

import { getParamObj, formatInputNumber, parserInputNumber } from '@/utils/commonFn'
import EditWrap from '@/components/sport/EditWrap'
import ProUpload from '@/components/common/upload'
import { SelectItem } from '@/components/common/table/types'
import { FootballTeamItem } from '../../types'

const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
}
const PlayerItems: FC = () => {
  const history = useHistory()
  const [form] = Form.useForm()
  const { search } = useLocation()
  const { type } = useParams()
  const { id } = getParamObj(search)
  const [teamList, saveTeamList] = useState<SelectItem[]>([])

  const SearchTeam = (data: string): void => {
    getFootballTeamList({ name: data, size: 999 }).then((res): void => {
      const { content = [] } = res.data
      const arr = content.map(
        ((item: FootballTeamItem): SelectItem => (
          { name: item.shortName, key: item.id }
        ))
      )
      const arrs = uniqWith([...arr], isEqual)
      saveTeamList(arrs)
    })
  }

  useEffect(() => {
    if (id) {
      getFootballPlayerItem({ id }).then((res) => {
        const { data } = res
        form.setFieldsValue(data)
      })
    }
    SearchTeam('')
    if (type === 'edit' && !id) {
      message.error('参数错误')
      history.replace('/football/player')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const toSave = (): void => {
    form.validateFields().then((data) => {
      const newData = {
        id,
        ...data
      }
      saveFootballPlayer(newData).then(() => {
        message.success('保存成功')
        history.replace('/football/player')
      })
    })
  }

  return (
    <div>
      <EditWrap title="基本信息">
        <Form
          form={form}
          {...formItemLayout}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="logo"
                label="球员头像"
              >
                <ProUpload uploadType="image" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="球员姓名"
                name="name"
                rules={[{ required: true, message: '请输入中文名' }]}
              >
                <Input placeholder="中文名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="中文简称"
                name="shortName"
                rules={[{ required: true, message: '请输入中文简称' }]}
              >
                <Input placeholder="中文简称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="原名"
                name="originalName"
              >
                <Input placeholder="原名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="teamId"
                label="所属球队"
                rules={[{ required: true, message: '请选择所属球队' }]}
              >
                <Select
                  placeholder="请选择"
                  filterOption={false}
                  allowClear
                  showSearch
                  onSearch={SearchTeam}
                  onChange={(value): void => {
                    if (value === undefined) {
                      SearchTeam('')
                    }
                  }}
                >
                  {
                    teamList.map((item: SelectItem) => (
                      <Option
                        key={item.key}
                        value={item.key}
                      >
                        {item.name}
                      </Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="jersey"
                label="球衣号"
              >
                <Input placeholder="球衣号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="position"
                label="位置"
              >
                <Input placeholder="位置" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="height"
                label="身高"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={formatInputNumber('m')}
                  parser={parserInputNumber('m')}
                  min={0}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="weight"
                label="体重"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={formatInputNumber('kg')}
                  parser={parserInputNumber('kg')}
                  min={0}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="habitualFoot"
                label="惯用脚"
              >
                <Input placeholder="惯用脚" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="birthday"
                label="出生日期"
              >
                <Input placeholder="出生日期" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="age"
                label="年龄"
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="country"
                label="国籍"
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="expirationOfContract"
                label="合同到期"
              >
                <Input placeholder="合同到期" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="agent"
                label="经纪人"
              >
                <Input placeholder="经纪人" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="referenceValue"
                label="参考身价"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </EditWrap>
      <Space
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button onClick={(): void => {
          history.replace('/football/player')
        }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={(): void => {
            toSave()
          }}
        >
          保存
        </Button>
      </Space>
    </div>
  )
}

export default PlayerItems
