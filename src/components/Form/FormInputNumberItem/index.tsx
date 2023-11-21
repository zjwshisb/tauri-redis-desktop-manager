import { InputNumber, type InputNumberProps } from 'antd'
import React from 'react'

import CusFormItem, { type CusFormItemProps } from '../CusFormItem'

const FormInputNumberItem: React.FC<
  Omit<CusFormItemProps<InputNumberProps>, 'render'>
> = (p) => {
  return (
    <CusFormItem
      {...p}
      render={(props = {}) => {
        const { keyboard = true, className = '!w-full', ...other } = props
        return (
          <InputNumber keyboard={keyboard} className={className} {...other} />
        )
      }}
    ></CusFormItem>
  )
}

export default FormInputNumberItem
