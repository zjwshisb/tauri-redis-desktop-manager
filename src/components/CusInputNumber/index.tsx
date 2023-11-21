import { InputNumber, type InputNumberProps } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CusInputNumber: React.FC<
  InputNumberProps & {
    label?: string
  }
> = (p) => {
  const { t } = useTranslation()

  const {
    placeholder = t('Please Enter {{name}}', {
      name: p.label !== undefined ? t(p.label) : ''
    }).toString(),
    className = '!w-full',
    keyboard = true,
    controls = true,
    ...others
  } = p

  return (
    <InputNumber
      className={className}
      placeholder={placeholder}
      controls={controls}
      keyboard={keyboard}
      {...others}
    ></InputNumber>
  )
}
export default CusInputNumber
