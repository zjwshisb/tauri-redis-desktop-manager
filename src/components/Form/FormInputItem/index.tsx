import { type InputProps, Input } from 'antd'
import React from 'react'

import CusFormItem, { type CusFormItemProps } from '../CusFormItem'

const FormInputItem: React.FC<Omit<CusFormItemProps<InputProps>, 'render'>> = (
  p
) => {
  return (
    <CusFormItem
      {...p}
      render={(props = {}) => {
        const { allowClear = true, ...other } = props
        return <Input allowClear={allowClear} {...other} />
      }}
    ></CusFormItem>
  )
}

export default FormInputItem
