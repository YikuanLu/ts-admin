import React, { FC } from 'react'
import { Modal, message } from 'antd'
import BraftEditor from 'braft-editor'
import {
  ControlType,
  ExtendControlType
} from 'braft-editor/index'
import { UploadFnParams, EditProps } from './editTypes'
import { getUploadSign, uploadFn as uploadApi } from '@/api/common'
import 'braft-editor/dist/index.css'
import style from './style.module.sass'
import { sourceSize } from '@/config/publicConfig'

const { info } = Modal

// 富文本默认配置
const defaultControls: ControlType[] = [
  'undo',
  'redo',
  'clear',
  'fullscreen',
  'separator',
  {
    key: 'media',
    title: `上传大小规范：图片不超过${sourceSize.imageSize / 1048576}M`,
    text: '上传'
  },
]

// 不允许添加尺寸大于50M的文件
const validateFn = (file: File): boolean => {
  if (file.type.includes('video')) {
    message.error('请在下方视频列表上传视频')
    return false
  }
  if (file.type.includes('image') && file.size > sourceSize.imageSize) {
    message.error(`图片上传文件大小超出限制（${sourceSize.imageSize / 1048576}M）`)
    return false
  }
  return true
}

// 上传类型
const accepts = {
  image: 'image/*',
  video: 'false',
}

const externals = {
  image: false,
  // video: false,
  // audio: true,
}

const RichEdit: FC<EditProps> = (props: EditProps) => {
  const { value, onChange } = props

  const uploadFn = async (params: UploadFnParams): Promise<void> => {
    const { type } = params.file
    const fileType: string = type.split('/')[1] // 文件类型
    const res = await getUploadSign({
      type: fileType
    })
    const { data } = res
    const { url, formData: dataForm, fileName } = data
    const formData = new FormData()
    dataForm.map((item: { key: string, value: string }) => {
      formData.append(item.key, item.value)
      return item
    })
    formData.append('file', params.file)
    const onUploadProgress = {
      onUploadProgress: (progressEvent: { loaded: number, total: number }): void => {
        const percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
        params.progress(percent)
      }
    }
    const response = await uploadApi(`${url}`, formData, onUploadProgress)
    if (response.status === 200) {
      const id = fileName.split('.')[0]
      params.success({
        url: `${url}${fileName}`,
        meta: {
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          id,
          title: 'title',
          alt: fileName,
          poster: '',
        }
      })
    } else {
      message.error('上传失败')
    }
  }

  // 自定义扩展
  const extendControls: ExtendControlType[] = [
    'separator',
    {
      key: 'view-html', // 控件唯一标识，必传
      type: 'button',
      title: '预览', // 指定鼠标悬停提示文案
      text: '查看预览', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
      onClick: (): void => {
        const curHtml = BraftEditor.createEditorState(value).toHTML()
        info({
          width: '60%',
          icon: false,
          title: '当前内容的html',
          maskClosable: true,
          okText: '关闭',
          content: (
            <div
              className="articleContent"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: curHtml }}
            />
          )
        })
      }
    },
  ]

  return (
    <div className={style.editBox}>
      <BraftEditor
        contentClassName={style.myEditor}
        controls={defaultControls}
        stripPastedStyles
        media={{
          uploadFn,
          validateFn,
          accepts,
          externals,
          pasteImage: false,
        }}
        value={BraftEditor.createEditorState(value)}
        onChange={onChange}
        extendControls={extendControls}
      />
    </div>
  )
}

export default RichEdit
