import FormInputItem from '@/components/Form/FormInputItem'
import React from 'react'

const BaseKeyForm: React.FC<
  React.PropsWithChildren<{
    readonly?: boolean
  }>
> = (p) => {
  return (
    <>
      <FormInputItem
        label="Key"
        name={'name'}
        required
        inputProps={{
          readOnly: p.readonly
        }}
      />
      {p.children}
    </>
  )
}
export default BaseKeyForm
