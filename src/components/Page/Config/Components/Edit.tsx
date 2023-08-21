import { Form, Input } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import CusModal from '@/components/CusModal'

const Edit: React.FC<{
  connection: APP.Connection
  field: APP.Field
  trigger: React.ReactElement
  onSuccess: (newField: APP.HashField) => void
}> = (props) => {
  const [form] = useForm()

  const { t } = useTranslation()

  return (
    <CusModal
      trigger={props.trigger}
      onOk={async () => {
        await request<number>('config/edit', props.connection.id, {
          name: props.field.name,
          value: form.getFieldValue('value')
        }).then(() => {
          props.onSuccess(form.getFieldsValue())
        })
      }}
      title={t('Edit Config')}
      onClear={() => {
        form.resetFields()
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...props.field
        }}
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
      </Form>
    </CusModal>
  )
}
export default Edit
