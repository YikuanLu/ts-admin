import React, { FC } from 'react'

import style from './style.module.sass'

export interface ShowLogoNameProps {
  logo: string,
  name: string,
  englishName: string
}

const ShowLogoName: FC<ShowLogoNameProps> = (props: ShowLogoNameProps) => {
  const { logo, name, englishName } = props
  return (
    <div className={style.outBox}>
      <div className={style.logo}>
        <img className="circle" src={logo || '--'} alt="" />
      </div>
      <div className={style.textBox}>
        <div className={style.name}>
          {name || '--'}
        </div>
        <div className={style.desc}>
          {englishName || '--'}
        </div>
      </div>
    </div>
  )
}

export default ShowLogoName
