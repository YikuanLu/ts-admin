import React, { FC, useEffect, useState } from 'react'

import { Form, Button, Row, Col, Input, Select, InputNumber, message } from 'antd'
import { useHistory, useParams } from 'react-router-dom'

import { BasketballTeamItem } from '@/pages/sport/basketball/types'
import {
  getBasketballPlayerItem,
  getBasketballTeamList,
  updateBasketballPlayerItem
} from '@/api/sport/basketball'

import ProUpload from '@/components/common/upload'
import { parserInputNumber, formatInputNumber } from '@/utils/commonFn'

const { Option } = Select

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
const rowItemLayout = {
  labelCol: {
    lg: { span: 3 },
    md: { span: 24 }
  },
  wrapperCol: {
    lg: { span: 21 },
    md: { span: 24 }
  }
}
const colSpan = 8
const rowpan = 16

const BasketballPlayerItems: FC = () => {
  const history = useHistory()
  const { id } = useParams()
  const [form] = Form.useForm()
  const [teamList, setMatchList] = useState([])
  useEffect(() => {
    getBasketballTeamList({
      size: 999
    }).then((res): void => {
      const { content = [] } = res.data
      setMatchList(content)
    })
    if (id === 'add') return
    getBasketballPlayerItem({ id }).then((res) => {
      const { data } = res
      form.setFieldsValue(data)
    })
  }, [form, id])

  const btnGroup = (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Button
        type="primary"
        style={{
          marginRight: '20px',
          backgroundColor: '#aaaaaa',
          borderColor: '#aaaaaa',
        }}
        onClick={(): void => {
          history.push('/basketball/player')
        }}
      >
        取消
      </Button>
      <Button
        type="primary"
        onClick={(): void => {
          form.validateFields().then((res) => {
            const data = {
              ...res,
              id: id === 'add' ? undefined : id
            }
            updateBasketballPlayerItem(data).then(() => {
              const msg = id === 'add' ? '添加成功' : '修改成功'
              message.success(msg)
              history.push('/basketball/player')
            })
          })
        }}
      >
        保存
      </Button>
    </div>
  )

  return (
    <div
      style={{
        maxWidth: '900px'
      }}
    >
      <Form
        form={form}
        {...formStyle}
      >
        <h3>基本信息</h3>
        <Row gutter={16}>
          <Col span={colSpan}>
            <Form.Item
              label="球员头像"
              name="logo"
            >
              <ProUpload
                aspect={1 / 1}
                uploadType="image"
                showText="点击上传"
              />
            </Form.Item>
          </Col>
        </Row>
        {/* ================================================== */}
        <Row gutter={16}>
          <Col span={colSpan}>
            <Form.Item
              label="球员姓名"
              name="name"
              rules={[{
                required: true,
                message: '请输入球员姓名'
              }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="中文简称"
              name="shortName"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="球员原名"
              name="originalName"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* ================================================== */}
        <Row gutter={16}>
          <Col span={colSpan}>
            <Form.Item
              label="所属赛队"
              name="teamId"
              rules={[{
                required: true,
                message: '请选择所属赛队'
              }]}
            >
              <Select
                showSearch
                filterOption={false}
                allowClear
                onChange={(val): void => {
                  if (val === undefined) {
                    getBasketballTeamList({
                      size: 999,
                      name: val
                    }).then((res): void => {
                      const { content = [] } = res.data
                      setMatchList(content)
                    })
                  }
                }}
                onSearch={(val): void => {
                  getBasketballTeamList({
                    size: 999,
                    name: val
                  }).then((res): void => {
                    const { content = [] } = res.data
                    setMatchList(content)
                  })
                }}
              >
                {
                  teamList.map((item: BasketballTeamItem) => (
                    <Option key={item.id} value={item.id}>{item.shortName}</Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="位置"
              name="position"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="球衣号"
              name="jersey"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* ================================================== */}
        <Row gutter={16}>
          <Col span={colSpan}>
            <Form.Item
              label="身高"
              name="height"
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
          <Col span={colSpan}>
            <Form.Item
              label="臂展"
              name="armSpread"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={formatInputNumber('m')}
                parser={parserInputNumber('m')}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="站立摸高"
              name="standingReach"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={formatInputNumber('m')}
                parser={parserInputNumber('m')}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* ================================================== */}
        <Row gutter={16}>
          <Col span={colSpan}>
            <Form.Item
              label="体重"
              name="weight"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="出生日期"
              name="birthday"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="年龄"
              name="age"
            >
              <InputNumber
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* ================================================== */}
        <Row gutter={16}>
          <Col span={rowpan}>
            <Form.Item
              {...rowItemLayout}
              label="选秀"
              name="draftRank"
            >
              <Input placeholder="e.g 2003年第1轮第1顺位被骑士选中" />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="国籍"
              name="country"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {btnGroup}
    </div>
  )
}

export default BasketballPlayerItems
