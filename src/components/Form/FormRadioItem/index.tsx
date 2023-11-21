import { Radio, type RadioGroupProps } from 'antd'
import React from 'react'

import CusFormItem, { type CusFormItemProps } from '../CusFormItem'

const FormRadioItem: React.FC<
  Omit<CusFormItemProps<RadioGroupProps>, 'render'>
> = (p) => {
  return (
    <CusFormItem
      {...p}
      requiredMsg="Please select {{name}}"
      render={(props = {}) => {
        const { optionType = 'button', ...other } = props
        return <Radio.Group optionType={optionType} {...other} />
      }}
    ></CusFormItem>
  )
}

export default FormRadioItem
