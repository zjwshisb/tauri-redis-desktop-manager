import React from 'react'

import { Form, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import FormListItem from '@/components/FormListItem/Index'

const ValueItem: React.FC<{
  label?: string
}> = ({ label = 'Value' }) => {
  const { t } = useTranslation()

  return (
    <FormListItem
      name="value"
      itemProps={{
        label
      }}
      renderItem={({ name, ...restField }) => {
        return (
          <Form.Item {...restField} name={[name]} rules={[{ required: true }]}>
            <InputNumber
              stringMode
              placeholder={t('Please Enter').toString()}
              className="!w-full"
            />
          </Form.Item>
        )
      }}
    ></FormListItem>
  )
}
export default ValueItem
