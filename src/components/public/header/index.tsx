import React, { FC } from 'react'
import HeaderDropdown from '@/components/public/headerDropdown'
import style from './style.module.sass'

const Header: FC = () => (
  <header className={style.header}>
    <HeaderDropdown />
  </header>
)

export default Header
