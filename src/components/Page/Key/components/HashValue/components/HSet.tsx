import { Col, Form, Input, Row } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/FormListItem'

const FieldForm: React.FC<{
  keys: APP.HashKey
  field?: APP.Field
  trigger: React.ReactElement
  onSuccess: () => void
}> = (props) => {
  const { t } = useTranslation()

  const isEdit = React.useMemo(() => {
    return props.field !== undefined
  }, [props.field])

  const defaultValue = React.useMemo(() => {
    if (props.field != null) {
      return {
        value: [
          {
            ...props.field
          }
        ]
      }
    } else {
      return {
        value: [
          {
            field: undefined,
            value: undefined
          }
        ]
      }
    }
  }, [props.field])

  return (
    <ModalForm
      title={'HSET'}
      documentUrl="https://redis.io/commands/hset/"
      width={800}
      defaultValue={defaultValue}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('key/hash/hset', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          ...v
        }).then(() => {
          props.onSuccess()
        })
      }}
    >
      <FormListItem
        name="value"
        itemProps={{
          label: ''
        }}
        showAdd={props.field === undefined}
        renderItem={(field) => {
          return (
            <Row gutter={20}>
              <Col span={8}>
                <Form.Item
                  name={[field.name, 'field']}
                  label={t('Field Name')}
                  rules={[{ required: true }]}
                >
                  <Input readOnly={isEdit}></Input>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name={[field.name, 'value']}
                  label={t('Field Value')}
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
export default FieldForm
