import React, { FC, ReactElement } from 'react'

import styles from './style.module.sass'

interface EditWrapProps {
  children: ReactElement,
  title?: string
}

const EditWrap: FC<EditWrapProps> = (props: EditWrapProps) => {
  const { children, title = '标题' } = props
  return (
    <div className={styles.box}>
      <p className={styles.title}>
        {title}
      </p>
      <div className={styles.wrap}>
        {children}
      </div>
    </div>
  )
}

export default EditWrap
