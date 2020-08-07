import React, { FC, useEffect, useState } from 'react'
import {
  Row,
  Col,
  Table,
  Button,
  Form,
  Input,
  // Modal,
  message
} from 'antd'
// import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useParams, useHistory, Link } from 'react-router-dom'
import {
  getMaterialItem,
  auditMaterialItem,
  auditFailMaterialItem,
  quoteMaterial
} from '@/api/main'
import { MaterialItem, Status } from '../../type'
import { ArtTypes, MaterialTypes } from '@/pages/main/statusType'

import style from './style.module.sass'
import { SportTypes } from '@/config/data'
import { SportType } from '@/config/dataTypes'

// const { confirm } = Modal

const defaultMaterial: MaterialItem = {
  itemType: 'BASKETBALL',
  auditId: 0,
  auditName: '',
  auditTime: '',
  channels: [],
  collectNum: 0,
  commentNum: 0,
  content: '',
  cover: '',
  createTime: '',
  downloadPlatform: '',
  downloadTime: '',
  giveNum: 0,
  id: 0,
  keywords: [],
  link: '',
  quote: false,
  records: [],
  releaseTime: '',
  shareNum: 0,
  status: 'CREATE',
  subjectHot: 0,
  subjectName: '',
  title: '',
  type: 'PICTURE',
  viewNum: 0,
}

const recordsColumns = [
  {
    title: '操作时间',
    dataIndex: 'createTime'
  },
  {
    title: '操作事务',
    render: (value: {
      text: string,
      quoteArticleId: string,
      nickName: string
    }): React.ReactElement => {
      const { quoteArticleId, text, nickName } = value
      const result = quoteArticleId === '0' ? text : (
        <span>
          {text}
          （操作人：
          {nickName}
          文章ID：
          <Link to={`/article/edit?id=${quoteArticleId}`}>{quoteArticleId}</Link>
          ）
        </span>
      )
      return (
        <span>
          {result}
        </span>
      )
    }
  }
]

const rowSpan = 16
const colSpan = 8


const formItemLayout = {
  labelCol: {
    lg: { span: 6 },
    md: { span: 24 }
  },
  wrapperCol: {
    lg: { span: 18 },
    md: { span: 24 }
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

const MaterialEdit: FC = () => {
  const [itemData, setItemData] = useState(defaultMaterial)
  const [canEdit, setCanEdit] = useState(false)
  const [form] = Form.useForm()
  const { id = '' } = useParams()
  const history = useHistory()

  // 找不到素材错误跳回列表处理
  const sourceNoFound = (err: string): void => {
    if (err === 'SOURCE_NOT_FOUND' || err === 'Argument') {
      history.replace('/material/list')
    }
  }

  // 初始化数据
  const getData = (): void => {
    getMaterialItem({ id }).then((res) => {
      setCanEdit(false)
      const { type, title, content } = res.data
      form.setFieldsValue({
        type,
        title,
        content
      })
      setItemData(res.data as MaterialItem)
    }).catch((err) => {
      sourceNoFound(err.data.code)
    })
  }

  useEffect(() => {
    getData()
    return (): void => { }
    // eslint-disable-next-line
  }, [id])

  const auditApi = (): void => {
    auditMaterialItem({ id }).then(() => {
      message.success('已经标为已处理')
      getData()
    }).catch((err) => {
      sourceNoFound(err.data.code)
    })
  }

  const auditFailApi = (): void => {
    auditFailMaterialItem({ id }).then(() => {
      message.success('已经标为未处理')
      getData()
    }).catch((err) => {
      sourceNoFound(err.data.code)
    })
  }

  const toConfirm = (fn: () => void): void => {
    fn()
    // confirm({
    //   title: '是否确认执行该操作?',
    //   icon: <ExclamationCircleOutlined />,
    //   okType: 'primary',
    //   okText: '是',
    //   cancelText: '否',
    //   onOk() {
    //     fn()
    //   }
    // })
  }


  // const canShowQuote = !canEdit && itemData.quote === false

  const btnList = [
    {
      label: '标为已处理',
      key: 'pass',
      isShow: itemData.status === 'CREATE',
      fn: (): void => {
        toConfirm(auditApi)
      }
    },
    {
      label: '标为未处理',
      key: 'unPass',
      isShow: itemData.status === 'AUDIT',
      fn: (): void => {
        toConfirm(auditFailApi)
      }
    },
    {
      label: '引用素材',
      key: 'quote',
      isShow: true,
      fn: (): void => {
        quoteMaterial<{ ids: string[] }>({ ids: [id] }).then(() => {
          message.success('引用成功，请到文章列表查看')
          getData()
        }).catch((err) => {
          sourceNoFound(err.data.code)
        })
      }
    },
    {
      label: '返回',
      key: 'back',
      isShow: true,
      fn: (): void => {
        history.push('/material/list')
      }
    },
  ]

  // 数组长度为0展示为'--
  function showArrText(data: string[]): string[] | '--' {
    return data.length === 0 ? '--' : data.map((item, index) => {
      if (index === 0) {
        return item
      }
      return `, ${item}`
    })
  }

  // 渲染Button
  const showBtnGroup = (): React.ReactNode[] => btnList.map((item) => {
    if (item.isShow) {
      return (
        <Button
          type={item.key === 'cancel' ? 'default' : 'primary'}
          style={{ marginRight: '10px' }}
          key={item.key}
          onClick={item.fn}
        >
          {item.label}
        </Button>
      )
    }
    return null
  })

  // 可编辑的字段：文章类型、文章标题、文章详情内容；其余字段都不可编辑；
  return (
    <div>
      <div className={style.btnGroup}>
        {showBtnGroup()}
      </div>

      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        labelAlign="left"
      >
        <Row>
          <Col span={colSpan}>
            <Form.Item label="文章类型">
              <div>{ArtTypes[itemData.type]}</div>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="体育项目">
              <div>{SportTypes[itemData.itemType as SportType]}</div>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="处理状态">
              <div>{MaterialTypes[itemData.status as Status]}</div>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={colSpan}>
            <Form.Item label="采取平台">
              <div>{itemData.downloadPlatform || '--'}</div>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="采取时间">
              <div>{itemData.downloadTime || '--'}</div>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="原文发布时间">
              <div>{itemData.releaseTime || '--'}</div>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={colSpan}>
            <Form.Item label="原文浏览数">
              <div>{itemData.viewNum}</div>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="原文点赞数">
              <div>{itemData.giveNum}</div>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="原文回复数">
              <div>{itemData.commentNum}</div>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={colSpan}>
            <Form.Item label="原文转发数">
              <div>{itemData.shareNum}</div>
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label="原文收藏数">
              <div>{itemData.collectNum}</div>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item {...rowItemLayout} label="原文链接">
              <a rel="noopener noreferrer" target="_blank" href={itemData.link}>{itemData.link || '暂无外链'}</a>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item {...rowItemLayout} label="原文频道">
              <div>
                {
                  showArrText(itemData.channels)
                }
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item {...rowItemLayout} label="原文话题">
              <div>
                {itemData.subjectName || '--'}
                {
                  itemData.subjectName && `（热度${itemData.subjectHot}）`
                }
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item {...rowItemLayout} label="关键字">
              <div>
                {showArrText(itemData.keywords)}
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item {...rowItemLayout} label="文章标题">
              {
                !canEdit ? <div>{itemData.title}</div> : <Input disabled={!canEdit} />
              }
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item {...rowItemLayout} label="文章详情">
              <div
                className="articleContent"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: itemData.content }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item {...rowItemLayout} label="文章封面">
              <img className={style.cover} src={itemData.cover} alt="" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item {...rowItemLayout} label="操作记录">
              <Table
                size="small"
                bordered
                rowKey="createTime"
                columns={recordsColumns}
                dataSource={itemData.records}
                pagination={false}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default MaterialEdit
