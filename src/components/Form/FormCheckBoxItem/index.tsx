import { Checkbox, type CheckboxProps } from 'antd'
import React from 'react'

import CusFormItem, { type CusFormItemProps } from '../CusFormItem'

const FormCheckBoxItem: React.FC<
  Omit<CusFormItemProps<CheckboxProps>, 'render'>
> = (p) => {
  return (
    <CusFormItem
      {...p}
      valuePropName="checked"
      requiredMsg="Please select {{name}}"
      render={(props = {}) => {
        const { ...other } = props
        return <Checkbox {...other} />
      }}
    ></CusFormItem>
  )
}

export default FormCheckBoxItem
