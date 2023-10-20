import { Form, Button, Input, Row, Col } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/FieldInput'

const TopK: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Form.List
      name="value"
      rules={[
        {
          validator: async (_, names) => {
            if (names === undefined || names.length < 1) {
              return await Promise.reject(
                new Error(t('At least 1 value').toString())
              )
            }
          }
        }
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Row key={key} gutter={20}>
              <Col span={8}>
                <Form.Item
                  {...restField}
                  name={[name, 'field']}
                  label={t('Field Name')}
                  rules={[{ required: true }]}
                >
                  <Input placeholder={t('Field Name').toString()} />
                </Form.Item>
              </Col>
              <Col span={15}>
                <Form.Item
                  {...restField}
                  label={t('Field Value')}
                  name={[name, 'value']}
                  rules={[{ required: true }]}
                >
                  <FieldInput />
                </Form.Item>
              </Col>
              <Col span={1}>
                {fields.length > 1 && (
                  <MinusCircleOutlined
                    onClick={() => {
                      remove(name)
                    }}
                  />
                )}
              </Col>
            </Row>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => {
                add()
              }}
              block
              icon={<PlusOutlined />}
            >
              {t('Add Field')}
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  )
}
export default TopK
