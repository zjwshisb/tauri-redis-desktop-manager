import { Form } from 'antd'
import React from 'react'
import FieldInput from '@/components/InputJson'
import FormListItem from '@/components/Form/FormListItem'

const ArrayItem: React.FC = () => {
  return (
    <FormListItem
      name="value"
      renderItem={(field) => {
        return (
          <Form.Item
            {...field}
            name={[field.name]}
            rules={[{ required: true }]}
          >
            <FieldInput />
          </Form.Item>
        )
      }}
      required
      label="Value"
    ></FormListItem>
  )
}
export default ArrayItem
