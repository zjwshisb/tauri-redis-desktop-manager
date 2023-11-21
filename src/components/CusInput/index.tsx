import { Input, type InputProps } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CusInput: React.FC<
  InputProps & {
    label?: string
  }
> = (p) => {
  const { t } = useTranslation()

  const {
    placeholder = t('Please Enter {{name}}', {
      name: p.label !== undefined ? t(p.label) : ''
    }).toString(),
    allowClear = true,
    ...others
  } = p

  return (
    <Input
      placeholder={placeholder}
      allowClear={allowClear}
      {...others}
    ></Input>
  )
}
export default CusInput
