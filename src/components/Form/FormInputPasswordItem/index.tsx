import { type InputProps, Input } from 'antd'
import React from 'react'

import CusFormItem, { type CusFormItemProps } from '../CusFormItem'

const FormInputPasswordItem: React.FC<
  Omit<CusFormItemProps<InputProps>, 'render'>
> = (p) => {
  return (
    <CusFormItem
      {...p}
      render={(props = {}) => {
        const { allowClear = true, ...other } = props
        return <Input.Password allowClear={allowClear} {...other} />
      }}
    ></CusFormItem>
  )
}

export default FormInputPasswordItem
