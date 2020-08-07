import React, { FC, useEffect, useState } from 'react'
import { Modal, Form, Select, Input, Radio, InputNumber, message } from 'antd'
import _ from 'lodash'
import { SortTypes, ReplyModalProps } from '@/pages/main/comment/types'
import { getClientUser } from '@/api/user'
import { addCommentItem } from '@/api/main'
import { ListParams } from '@/components/common/table/types'
import UploadMultiple from '@/components/common/upload/uploadMultiple'
import ProUpload from '@/components/common/upload'

import { sortTypes } from '@/pages/main/comment/statusType'

import ReplyBody, { ReplyBodyProps } from '@/components/main/comment/ReplyModal/ReplyBody'

import style from '@/components/main/comment/ReplyModal/style.module.sass'

interface UserList {
  uuid: string | number,
  id: string,
  nickName: string
}

const { Option } = Select
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}

const ReplyModal: FC<ReplyModalProps> = (props: ReplyModalProps) => {
  const [form] = Form.useForm()
  const { visible, itemData, cancelFn, updataList, type } = props

  const [userList, setUserList] = useState<UserList[]>([])
  const getUserList = async (data: ListParams): Promise<void> => {
    const res = await getClientUser(data)
    const { content = [] } = res.data
    setUserList(content)
  }

  useEffect(() => {
    if (visible) {
      getUserList({
        page: 0,
        size: 100
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemData, visible])

  const [replyBodyData, setReplyBodyData] = useState<ReplyBodyProps>({
    id: '',
    name: '',
    content: '',
    pics: [],
    video: ''
  })
  const [filesLength, setFilesLength] = useState(9)
  const [canUpload, setCanUpload] = useState(true)
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        orderType: 'COMMON'
      })
      let [id, name, content, pics, video] = ['', '', '', [], '']
      if (type === 'COMMENT') {
        const itemVideo = itemData.videos.length > 0 ? itemData.videos[0].url : ''
        id = itemData.id
        name = itemData.nickName
        content = itemData.content
        pics = itemData.pics
        video = itemVideo
      }
      if (type === 'QUOTE') {
        const itemVideo = itemData.reVideos.length > 0 ? itemData.reVideos[0].url : ''
        id = itemData.parentId
        name = itemData.reUserNickName
        content = itemData.reContent
        pics = itemData.rePics
        video = itemVideo
      }
      setReplyBodyData({ id, name, content, pics, video })
    }
  }, [type, visible, itemData, form])

  return (
    <Modal
      width={680}
      getContainer={false}
      afterClose={(): void => {
        setFilesLength(9)
        form.resetFields()
      }}
      destroyOnClose
      visible={visible}
      title="添加回复"
      onOk={(): void => {
        form.validateFields().then((formRes) => {
          if (
            formRes.pics.length === 0
            && formRes.content === undefined
            && _.isEmpty(formRes.videos)) {
            message.error('回复内容或图片或视频必须有一项不为空')
            return
          }
          let pics
          if (formRes.pics) {
            pics = formRes.pics.map((item: { name: string }, index: number) => ({
              fileName: item.name,
              height: 0,
              orderNum: index,
              width: 0
            }))
          }
          // const videos = JSON.stringify(formRes.videos) === '{}'
          const videos = _.isEmpty(formRes.videos)
            ? undefined
            : [formRes.videos]
          const id = type === 'COMMENT' ? itemData.id : (type === 'QUOTE' ? itemData.parentId : undefined)
          const params = {
            ...formRes,
            orderNum: formRes.orderNum || null,
            commentType: 'ARTICLE',
            businessId: itemData.businessId,
            parentId: id,
            videos,
            pics: pics.length === 0 ? undefined : pics
          }
          addCommentItem(params).then(() => {
            updataList()
            cancelFn()
          })
        })
      }}
      onCancel={(): void => {
        setFilesLength(9)
        cancelFn()
      }}
    >
      <Form
        form={form}
        {...formItemLayout}
        labelAlign="left"
        className={style.formBox}
        onValuesChange={(): void => {
          const formData = form.getFieldsValue()
          if (formData.pics && formData.pics.length === 9) {
            setCanUpload(false)
          } else {
            setCanUpload(true)
          }
        }}
      >
        <Form.Item label="所属文章">
          {itemData.articleStr}
          {type !== 'ARTICLE' && <ReplyBody {...replyBodyData} />}
        </Form.Item>
        <Form.Item
          label="回复用户"
          name="userId"
          rules={[
            { required: true, message: '请选择回复用户' }
          ]}
        >
          <Select
            allowClear
            showSearch
            filterOption={false}
            onSearch={(nickname): void => {
              getUserList({
                nickname,
                page: 0,
                size: 100
              })
            }}
            onChange={(val): void => {
              if (val === undefined) {
                getUserList({
                  page: 0,
                  size: 100
                })
              }
            }}
          >
            {
              userList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {`[${item.uuid}] ${item.nickName}`}
                </Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="回复内容"
          name="content"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="上传图片"
          name="pics"
        >
          <UploadMultiple
            filesLength={filesLength}
            uploadType="image"
          />
        </Form.Item>
        <Form.Item
          label="上传视频"
          name="videos"
        >
          <ProUpload
            uploadType="video"
            canUpload={canUpload}
            unUploadMsg="上传图片和视频无法超过9张"
            getIsEmpty={(statue): void => {
              if (statue) {
                setFilesLength(9)
              } else {
                setFilesLength(8)
              }
            }}
          />
        </Form.Item>
        <Form.Item label="排序方式" name="orderType">
          <Radio.Group>
            {
              sortTypes.map((item: { name: string, key: SortTypes }) => (
                <Radio value={item.key} key={item.key}>{item.name}</Radio>
              ))
            }
          </Radio.Group>
        </Form.Item>
        <Form.Item label="排序值" name="orderNum">
          <InputNumber
            formatter={(value): string => {
              if (value?.toString().includes('.')) {
                return value.toString().split('.')[0]
              }
              return `${value}`
            }}
            min={1}
            precision={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReplyModal
