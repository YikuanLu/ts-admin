import { ReactElement } from 'react'

export interface NoneContent {
  color?: string; // 可上传数量
  showText?: string | number;
  className?: string;
  title?: string;
  children?: ReactElement;
  noneText?: string;
}
