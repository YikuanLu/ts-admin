import React, { FC } from 'react'

interface SectionInfoProps {
  icon: string;
  name: string
}

const SectionInfo: FC<SectionInfoProps> = (props: SectionInfoProps) => {
  const { icon, name } = props
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={icon}
          style={{
            width: '50px', height: '50px', borderRadius: '50%'
          }}
          alt=""
        />
        <span>{` #${name}`}</span>
      </div>
    </div>
  )
}

export default SectionInfo
