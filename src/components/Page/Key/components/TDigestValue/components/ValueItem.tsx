import React from 'react'

import FormListItem from '@/components/Form/FormListItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const ValueItem: React.FC<{
  label?: string
}> = ({ label = 'Value' }) => {
  return (
    <FormListItem
      name="value"
      label={label}
      required
      renderItem={({ name, ...restField }) => {
        return (
          <FormInputNumberItem
            {...restField}
            name={[name]}
            required
          ></FormInputNumberItem>
        )
      }}
    ></FormListItem>
  )
}
export default ValueItem
