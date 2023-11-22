import React from 'react'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'

const SimpleArrayItem: React.FC = () => {
  return (
    <FormListItem
      name="value"
      renderItem={(field) => {
        return <FormInputItem {...field} required />
      }}
      label="Value"
      required
    ></FormListItem>
  )
}
export default SimpleArrayItem
