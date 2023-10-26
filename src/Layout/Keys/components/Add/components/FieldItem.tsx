import { Form, Input, Row, Col } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/FieldInput'
import FormListItem from '@/components/FormListItem/Index'

const FieldItem: React.FC = () => {
  const { t } = useTranslation()

  return (
    <FormListItem
      name="value"
      renderItem={({ name, ...restField }) => {
        return (
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                {...restField}
                name={[name, 'field']}
                label={t('Field Name')}
                rules={[{ required: true }]}
              >
                <Input placeholder={t('Field Name').toString()} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...restField}
                label={t('Field Value')}
                name={[name, 'value']}
                rules={[{ required: true }]}
              >
                <FieldInput />
              </Form.Item>
            </Col>
          </Row>
        )
      }}
      itemProps={{
        label: t('Value')
      }}
    ></FormListItem>
  )
}
export default FieldItem
