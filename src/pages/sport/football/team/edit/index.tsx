import React, { FC, useEffect, useState } from 'react'

import { Form, Row, Col, Input, Select, InputNumber, Button, Space, message } from 'antd'
import { useHistory, useParams, useLocation } from 'react-router-dom'

import { uniqWith, isEqual } from 'lodash'
import { FootballMatchItem } from '@/pages/sport/football/types'
import { getFootballTeamItem, getFootballMatchList, saveFootballTeam } from '@/api/sport/football'

import ProUpload from '@/components/common/upload'
import { SelectItem } from '@/components/common/table/types'
import EditWrap from '@/components/sport/EditWrap'
import { getParamObj, formatInputNumber, parserInputNumber } from '@/utils/commonFn'
import { getOssUrl } from '@/config/publicConfig'

const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
}
const TeamItems: FC = () => {
  const history = useHistory()
  const [form] = Form.useForm()
  const { search } = useLocation()
  const { type } = useParams()
  const { id } = getParamObj(search)
  const [matchList, saveMatchList] = useState<SelectItem[]>([])

  const SearchMatch = (data: string): void => {
    getFootballMatchList({ name: data, size: 50 }).then((res): void => {
      const { content = [] } = res.data
      const arr = content.map(
        ((item: FootballMatchItem): SelectItem => (
          { name: item.shortName, key: item.id }
        ))
      )
      const arrs = uniqWith([...arr], isEqual)
      saveMatchList(arrs)
    })
  }

  useEffect(() => {
    if (id) {
      getFootballTeamItem({ id }).then((res) => {
        const { data } = res
        form.setFieldsValue(data)
      })
    }
    SearchMatch('')
    if (type === 'edit' && !id) {
      message.error('参数错误')
      history.replace('/football/team')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])


  const toSave = (): void => {
    form.validateFields().then((data) => {
      const newData = {
        id,
        ...data,
        logo: data.logo.includes('http')
          ? data.logo.split(`${getOssUrl()}/`)[1]
          : data.logo
      }
      saveFootballTeam(newData).then(() => {
        message.success('保存成功')
        history.replace('/football/team')
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
                label="球队头像"
              >
                <ProUpload uploadType="image" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="球队名称"
                name="name"
                rules={[{ required: true, message: '请输入中文名' }]}
              >
                <Input placeholder="中文名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="matchId"
                label="所属赛事"
                rules={[{ required: true, message: '请选择所属赛事' }]}
              >
                <Select
                  placeholder="请选择"
                  filterOption={false}
                  allowClear
                  showSearch
                  onSearch={SearchMatch}
                  onChange={(value): void => {
                    if (value === undefined) {
                      SearchMatch('')
                    }
                  }}
                >
                  {
                    matchList.map((item: SelectItem) => (
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
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="shortName"
                label="球队简称"
              >
                <Input placeholder="球队简称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="originalName"
                label="球队原名"
              >
                <Input placeholder="原名（非必填）" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="establishTime"
                label="成立时间"
              >
                <Input placeholder="成立时间" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="location"
                label="所在地区"
              >
                <Input placeholder="所在地区" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalValue"
                label="总身价"
              >
                <Input placeholder="总身价" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="homeCourt"
                label="主场"
              >
                <Input placeholder="主场" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="homeCourtCapacity"
                label="主场容量"
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
                name="officialWebsite"
                label="球队官网"
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
          history.replace('/football/team')
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

export default TeamItems
