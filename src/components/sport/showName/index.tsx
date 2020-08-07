import React, { FC } from 'react'
import style from './style.module.sass'

export interface ShowNameProps {
  name: string,
  logo?: string,
  englishName?: string,
}

const ShowName: FC<ShowNameProps> = (props: ShowNameProps) => {
  const { logo, name, englishName } = props
  return (
    <div className={style.outBox} title={name}>
      <div className={style.name}>
        {
          logo
          && <img className="circle" src={logo} alt="" />
        }
        <span>{name}</span>
      </div>
      {
        englishName !== undefined
        && (
          <div className={style.desc}>
            {englishName}
          </div>
        )
      }
    </div>
  )
}
export default ShowName
