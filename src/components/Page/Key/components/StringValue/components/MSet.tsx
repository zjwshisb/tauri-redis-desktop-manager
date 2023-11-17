import { Button, Col, Form, Input, Row } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/FormListItem'

const MSet: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      title={'MSET'}
      documentUrl="https://redis.io/commands/mset/"
      width={800}
      defaultValue={{
        value: [
          {
            field: keys.name,
            value: keys.data
          }
        ]
      }}
      trigger={<Button type="primary">MSET</Button>}
      onSubmit={async (v) => {
        await request<number>('string/mset', keys.connection_id, {
          db: keys.db,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <FormListItem
        name="value"
        itemProps={{
          label: ''
        }}
        renderItem={(field) => {
          return (
            <Row gutter={20}>
              <Col span={8}>
                <Form.Item
                  name={[field.name, 'field']}
                  label={t('Name')}
                  rules={[{ required: true }]}
                >
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name={[field.name, 'value']}
                  label={t('Value')}
                  rules={[{ required: true }]}
                >
                  <FieldInput></FieldInput>
                </Form.Item>
              </Col>
            </Row>
          )
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default MSet
