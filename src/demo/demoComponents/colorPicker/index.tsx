import React, { FC, useState, useEffect } from 'react'
import { PhotoshopPicker, ColorResult } from 'react-color'

import { Button } from 'antd'
import style from './style.module.sass'


interface ColorPickerProps {
  onChange?: (color: string) => void;
  onComplete?: (color: string) => void;
}
const ColorPicker: FC<ColorPickerProps> = (props: ColorPickerProps) => {
  const { onChange, onComplete } = props
  const [color, saveColor] = useState<string>('#000000')
  const [pickerStatus, setPickerStatus] = useState<boolean>(false)
  const handleChangeComplete = (colors: ColorResult): void => {
    const { hex } = colors
    saveColor(hex)
  }

  useEffect((): void => {
    if (onChange) {
      onChange(color)
    }
    if (onComplete) {
      onComplete(color)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color])

  return (
    <div className={style.colorBox}>
      <Button
        className={style.button}
        type="primary"
        onClick={(): void => {
          setPickerStatus(true)
        }}
      >
        更改颜色
      </Button>
      {pickerStatus && (
        <div className={style.box}>
          <PhotoshopPicker
            header="修改颜色"
            onAccept={(): void => {
              saveColor(color)
              setPickerStatus(false)
            }}
            onCancel={(): void => {
              setPickerStatus(false)
            }}
            color={color}
            onChange={handleChangeComplete}
            onChangeComplete={handleChangeComplete}
          />
        </div>
      )}
    </div>
  )
}

export default ColorPicker
