import React, { FC } from 'react'

import style from './style.module.sass'

interface SourceCoverProps {
  title?: string;
  img: string;
  imgStyle?: string
  imgTypeText: string
}

const SourceCover: FC<SourceCoverProps> = (props: SourceCoverProps) => {
  const { title, img, imgStyle, imgTypeText } = props
  return (
    <div
      title={title}
      className={style.imgTableItem}
    >
      <div className={style.imgBox}>
        <img
          className={style.img}
          src={img || '--'}
          alt="封面"
        />
        <span className={`${style.typeTip} ${imgStyle}`}>
          {imgTypeText}
        </span>
      </div>
      {title && (
        <span className={style.overFlowText}>
          {title}
        </span>
      )}
    </div>
  )
}

export default SourceCover
