import { Form } from 'antd'
import React from 'react'
import FieldInput from '@/components/FieldInput'
import FormListItem from '@/components/FormListItem/Index'
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
            rules={[{ required: true }]}
            validateTrigger={['onChange', 'onBlur']}
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
