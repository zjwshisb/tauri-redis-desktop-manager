import { Form } from 'antd'
import React from 'react'
import FieldInput from '@/components/InputJson'
import FormListItem from '@/components/Form/FormListItem'
import { useTranslation } from 'react-i18next'

const ArrayItem: React.FC = () => {
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
            <FieldInput />
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
export default ArrayItem
