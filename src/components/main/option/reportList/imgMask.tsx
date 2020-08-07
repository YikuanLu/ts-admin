import React, { FC } from 'react'
import { Modal } from 'antd'
import style from './style.module.sass'

interface ImgMaskProps {
  url: { imgUrl: string, videoUrl?: string };
  canClick?: boolean;
  type: string
}

const ImgMask: FC<ImgMaskProps> = (props: ImgMaskProps) => {
  const { url, canClick, type } = props
  const { imgUrl, videoUrl } = url
  return (
    <div
      className={style.sourceItem}
      onClick={(): void => {
        if (canClick) {
          Modal.info({
            title: '',
            width: '50%',
            maskClosable: true,
            icon: null,
            content: (
              type === 'img'
                ? <img style={{ width: '100%' }} src={imgUrl} alt="" />
                : (
                  <video
                    style={{
                      margin: 'auto',
                      display: 'block',
                      width: '100%'
                    }}
                    controls
                    src={videoUrl}
                  />
                )
            )
          })
        }
      }}
    >
      <img
        alt=""
        src={imgUrl}
      />
    </div>
  )
}

export default ImgMask
