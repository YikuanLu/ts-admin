import React from 'react'
import { NoneContent } from '@/components/common/noneContent/noneContent'

const NoneWrap: React.FC<NoneContent> = (props: NoneContent) => {
  const { color, showText, className, title, children, noneText } = props
  return (
    <p title={title} className={className} style={{ color, marginBottom: 0 }}>{children || showText || noneText || '--'}</p>
  )
}
export default NoneWrap
