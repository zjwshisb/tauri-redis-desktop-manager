import React from 'react'
import InputField, { type InputJsonProps } from '@/components/InputJson'
import CusFormItem, { type CusFormItemProps } from '../CusFormItem'

const FormInputJsonItem: React.FC<
  Omit<CusFormItemProps<InputJsonProps>, 'render'>
> = (p) => {
  return (
    <CusFormItem
      {...p}
      render={(p) => {
        return <InputField {...p}></InputField>
      }}
    ></CusFormItem>
  )
}

export default FormInputJsonItem
