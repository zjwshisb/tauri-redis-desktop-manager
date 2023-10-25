import React from 'react'

import { Button, Col, Form, InputNumber, Row } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const ValueItem: React.FC<{
  label?: string
}> = ({ label = 'Value' }) => {
  const { t } = useTranslation()

  return (
    <Form.Item
      label={label}
      tooltip="is value of an observation (floating-point)."
    >
      <Form.List name="value">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => {
              return (
                <Row key={name}>
                  <Col span={20}>
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        stringMode
                        placeholder={t('Please Enter').toString()}
                        className="!w-full"
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    {index > 0 && (
                      <MinusCircleOutlined
                        className="text-red-600 ml-2"
                        onClick={() => {
                          remove(name)
                        }}
                      />
                    )}
                  </Col>
                </Row>
              )
            })}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add()
                }}
                block
                icon={<PlusOutlined />}
              >
                Add {label}
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
  )
}
export default ValueItem
