import { Form, Row, Col, InputNumber } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/FieldInput'
import FormListItem from '@/components/FormListItem/Index'

const ScoreItem: React.FC = () => {
  const { t } = useTranslation()

  return (
    <FormListItem
      name="value"
      itemProps={{
        label: t('Value')
      }}
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
                <FieldInput />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...restField}
                label={t('Score')}
                name={[name, 'value']}
                rules={[{ required: true }]}
              >
                <InputNumber
                  placeholder={t('Please Enter').toString()}
                  className="!w-full"
                  stringMode
                />
              </Form.Item>
            </Col>
          </Row>
        )
      }}
    ></FormListItem>
  )
}
export default ScoreItem
