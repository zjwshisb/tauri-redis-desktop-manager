import { Input } from 'antd'
import React from 'react'

import CusFormItem, { type CusFormItemProps } from '../CusFormItem'
import { type TextAreaProps } from 'antd/es/input'

const FormTextareaItem: React.FC<
  Omit<CusFormItemProps<TextAreaProps>, 'render'>
> = (p) => {
  return (
    <CusFormItem
      {...p}
      render={(props = {}) => {
        const { allowClear = true, ...other } = props
        return <Input.TextArea allowClear={allowClear} {...other} />
      }}
    ></CusFormItem>
  )
}

export default FormTextareaItem
