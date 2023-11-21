import { Form } from 'antd'
import React from 'react'
import FormListItem from '@/components/Form/FormListItem'
import { useTranslation } from 'react-i18next'
import CusInput from '@/components/CusInput'

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
            <CusInput />
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
