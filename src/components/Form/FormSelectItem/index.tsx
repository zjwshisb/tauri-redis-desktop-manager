import { Select, type SelectProps } from 'antd'
import React from 'react'

import CusFormItem, { type CusFormItemProps } from '../CusFormItem'

const FormSelectItem: React.FC<
  Omit<CusFormItemProps<SelectProps>, 'render'>
> = (p) => {
  return (
    <CusFormItem
      {...p}
      requiredMsg="Please select {{name}}"
      render={(props = {}) => {
        const { allowClear = true, ...other } = props
        return <Select allowClear={allowClear} {...other} />
      }}
    ></CusFormItem>
  )
}

export default FormSelectItem
