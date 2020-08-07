import React, { FC, useEffect, useState } from 'react'

import { Form, Button } from 'antd'
import { useHistory, useParams } from 'react-router-dom'

import { FootballMatchItem } from '@/pages/sport/football/types'
import { getFootballMatchItem } from '@/api/sport/football'

import NoneWrap from '@/components/common/noneContent'

const defaultData: FootballMatchItem = {
  id: '0',
  createId: 0,
  createTime: '',
  updateId: 0,
  updateTime: '',
  logo: '',
  name: '',
  englishName: '',
  englishShortName: '',
  shortName: '',
  region: '',
  country: '',
  forbidden: false,
  articleNum: 0,
  subjectNum: 0,
  informationHot: 0,
  informationPopularity: 0,
  matchHot: 0,
  matchPopularity: 0,
  description: '',
  orderNum: 0
}

const FootballMatchItemVm: FC = () => {
  const history = useHistory()
  const [dataItem, setdataItem] = useState<FootballMatchItem>(defaultData)
  const { id = '' } = useParams()
  useEffect(() => {
    getFootballMatchItem({ id }).then((res) => {
      const { data } = res
      setdataItem(data as FootballMatchItem)
    })
  }, [id])
  return (
    <div>
      <Button
        type="primary"
        onClick={(): void => {
          history.push('/football/match')
        }}
        style={{
          marginBottom: '14px'
        }}
      >
        返回

      </Button>
      <Form>
        <Form.Item label="赛事logo">
          <img
            className="circle"
            style={{
              width: '90px'
            }}
            src={dataItem.logo}
            alt=""
          />
        </Form.Item>
        <Form.Item label="赛事名称中文">
          <NoneWrap showText={dataItem.name} />
        </Form.Item>
        <Form.Item label="英文">
          <NoneWrap showText={dataItem.englishName} />
        </Form.Item>
        <Form.Item label="中文简称">
          <NoneWrap showText={dataItem.shortName} />
        </Form.Item>
        <Form.Item label="英文简称">
          <NoneWrap showText={dataItem.englishShortName} />
        </Form.Item>
        <Form.Item label="所属区域">
          <NoneWrap showText={dataItem.region} />
        </Form.Item>
        <Form.Item label="所属国家">
          <NoneWrap showText={dataItem.country} />
        </Form.Item>
        <Form.Item label="体育项目">
          <div>
            足球
          </div>
        </Form.Item>
        <Form.Item label="排序">
          <NoneWrap showText={dataItem.orderNum} />
        </Form.Item>
        <Form.Item label="详细说明">
          <NoneWrap showText={dataItem.description} />
        </Form.Item>
      </Form>
    </div>
  )
}

export default FootballMatchItemVm
