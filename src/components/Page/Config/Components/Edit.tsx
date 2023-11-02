import { Form, Input } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/components/ModalForm'

const Edit: React.FC<{
  connection: APP.Connection
  field: APP.Field
  trigger: React.ReactElement
  onSuccess: (newField: APP.Field) => void
}> = (props) => {
  const { t } = useTranslation()

  return (
    <ModalForm
      defaultValue={{
        ...props.field
      }}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('config/edit', props.connection.id, {
          name: props.field.field,
          value: v.value
        })
        props.onSuccess(v as APP.Field)
      }}
      title={t('Edit Config')}
    >
      <Form.Item name={'name'} label={t('Name')}>
        <Input readOnly={true}></Input>
      </Form.Item>
      <Form.Item
        name={'value'}
        label={t('Value')}
        rules={[{ required: true, max: 512 }]}
      >
        <Input.TextArea rows={3}></Input.TextArea>
      </Form.Item>
    </ModalForm>
  )
}
export default Edit
