import { Form, Button, Row, Col } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/FieldInput'

const TopK: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Form.List
      name={'value'}
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
          {fields.map((field, index) => {
            console.log(field)
            return (
              <Form.Item
                label={index === 0 ? t('Value') : ''}
                required={index === 0}
                key={field.key}
              >
                <Row>
                  <Col span={20}>
                    <Form.Item
                      {...field}
                      label={''}
                      rules={[{ required: true }]}
                      validateTrigger={['onChange', 'onBlur']}
                      noStyle
                    >
                      <FieldInput />
                    </Form.Item>
                  </Col>
                  <Col>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        className="text-red-600 ml-2"
                        onClick={() => {
                          remove(field.name)
                        }}
                      />
                    )}
                  </Col>
                </Row>
              </Form.Item>
            )
          })}
          <Form.Item>
            <Button
              type="dashed"
              block
              onClick={() => {
                add()
              }}
              icon={<PlusOutlined />}
            >
              {t('Add Value')}
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  )
}
export default TopK
