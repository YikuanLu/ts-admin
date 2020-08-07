import React, { FC, useEffect, useState } from 'react'

import {
  Form, Button, Row, Col, Input, InputNumber, Select, message
} from 'antd'
import { useHistory, useParams } from 'react-router-dom'

import {
  // BasketballTeamItem,
  BasketballMatchItem
} from '@/pages/sport/basketball/types'
import {
  getBasketballTeamItem,
  getBasketballMatchList,
  updateBasketballTeamItem
} from '@/api/sport/basketball'

import ProUpload from '@/components/common/upload'
import { formatInputNumber, parserInputNumber } from '@/utils/commonFn'

const { Option } = Select

const colSpan = 8

const BasketballTeamItems: FC = () => {
  const history = useHistory()
  const { id } = useParams()
  const [matchList, setMatchList] = useState([])
  const [form] = Form.useForm()
  useEffect(() => {
    getBasketballMatchList({
      size: 999
    }).then((res): void => {
      const { content = [] } = res.data
      setMatchList(content)
    })
    if (id === 'add') return
    getBasketballTeamItem({ id }).then((res) => {
      const { data } = res
      form.setFieldsValue({
        logo: data.logo,
        name: data.name,
        shortName: data.shortName,
        originalName: data.originalName,
        homeCourt: data.homeCourt,
        homeCourtCapacity: data.homeCourtCapacity || 0,
        matchId: data.matchId,
        beDivision: data.beDivision,
        bePartition: data.bePartition,
      })
    })
  }, [form, id])

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
          history.push('/basketball/team')
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
            updateBasketballTeamItem(data).then(() => {
              const msg = id === 'add' ? '添加成功' : '修改成功'
              message.success(msg)
              history.push('/basketball/team')
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
        initialValues={{
          homeCourtCapacity: 0
        }}
        {...formStyle}
      >
        <h3>基本信息</h3>
        <Row gutter={16}>
          <Col span={colSpan}>
            <Form.Item
              label="球队头像"
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
              label="球队名称"
              name="name"
              rules={[{
                required: true,
                message: '请输入球队名称'
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
              label="球队原名"
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
              label="主场"
              name="homeCourt"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="主场容量"
              name="homeCourtCapacity"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={formatInputNumber('人')}
                parser={parserInputNumber('人')}
                min={0}
                precision={0}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* ================================================== */}
        <Row gutter={16}>
          <Col span={colSpan}>
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
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="所属赛区"
              name="beDivision"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item
              label="所属分区"
              name="bePartition"
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

export default BasketballTeamItems
