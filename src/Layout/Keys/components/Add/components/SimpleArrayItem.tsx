import { Form, Input } from 'antd'
import React from 'react'
import FormListItem from '@/components/FormListItem'
import { useTranslation } from 'react-i18next'

const SimpleArrayItem: React.FC = () => {
  const { t } = useTranslation()

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
            <Input />
          </Form.Item>
        )
      }}
      itemProps={{
        label: t('Value'),
        required: true
      }}
    ></FormListItem>
  )
}
export default SimpleArrayItem
