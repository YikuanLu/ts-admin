import React, { FC } from 'react'

import style from './style.module.sass'
import { getOssUrl } from '@/config/publicConfig'

interface BannerPreviewProps {
  img?: string
  showText?: string
}

const BannerPreview: FC<BannerPreviewProps> = (props: BannerPreviewProps) => {
  const { img = '', showText } = props
  const imgUrl = img.includes('http') ? img : `${getOssUrl()}/${img}`
  return (
    <div
      className={style.previewWrap}
    >
      <img src={img && imgUrl} alt="" />
      <p className={style.title}>
        {showText || '标题预览'}
      </p>
    </div>
  )
}

export default BannerPreview
