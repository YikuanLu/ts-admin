import React, { FC } from 'react'
import { Modal } from 'antd'
import replyBody from './replyBody.module.sass'

// import loadingImg from '@/assets/img/loading.gif'

export interface ReplyBodyProps {
  id: string | number,
  name: string,
  content: string,
  pics: { url: string }[],
  video: string
}

const showPreview = (data: { url: string }): void => {
  Modal.info({
    title: '预览图片',
    width: 900,
    content: (
      <div>
        <img
          className={replyBody.previewImg}
          src={data.url}
          alt=""
        />
      </div>
    )
  })
}

const ReplyBody: FC<ReplyBodyProps> = (props: ReplyBodyProps) => {
  const { id, name, content, pics, video } = props
  return (
    <div className={replyBody.body}>
      <div className={replyBody.title}>
        <span className={replyBody.user}>
          {
            `[${id}]${name}：`
          }
        </span>
        {content}
      </div>
      <div className={replyBody.imgGroupBox}>
        {
          pics.map((item, index) => {
            const key = new Date().getTime() + index
            return (
              <div key={key} className={replyBody.imgStyle}>
                <div
                  className={replyBody.imgBox}
                  onClick={(): void => { showPreview(item) }}
                >
                  <img
                    src={item.url}
                    alt=""
                  />
                </div>
              </div>
            )
          })
        }
      </div>
      {
        video
        && (
          <div>
            <video controls className={replyBody.video} src={video} />
          </div>
        )
      }
    </div>
  )
}

export default ReplyBody
