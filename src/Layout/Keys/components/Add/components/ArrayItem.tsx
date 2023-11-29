import React from 'react'
import FormListItem from '@/components/Form/FormListItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

const ArrayItem: React.FC = () => {
  return (
    <FormListItem
      name="value"
      renderItem={(field) => {
        return <FormInputJsonItem {...field} required />
      }}
      required
      label="Value"
    ></FormListItem>
  )
}
export default ArrayItem
