import { Form, Input, Modal, message } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  keys: APP.HashKey
  field?: APP.HashField
  trigger: React.ReactElement
  onSuccess: (newField: APP.HashField) => void
}> = (props) => {
  const [open, setOpen] = React.useState(false)

  const [form] = useForm(undefined)

  const [loading, setLoading] = React.useState(false)

  const { t } = useTranslation()

  const isEdit = React.useMemo(() => {
    return props.field !== undefined
  }, [props.field])

  const title = React.useMemo(() => {
    return isEdit ? t('Edit Field') : 'Add Field'
  }, [isEdit, t])

  const trigger = React.cloneElement(props.trigger, {
    onClick() {
      setOpen(true)
    }
  })

  return (
    <>
      {trigger}
      <Modal
        confirmLoading={loading}
        onOk={async () => {
          setLoading(true)
          await request<number>('key/hash/hset', props.keys.connection_id, {
            name: props.keys.name,
            field: form.getFieldValue('name'),
            value: form.getFieldValue('value'),
            db: props.keys.db
          })
            .then(() => {
              message.success('success')
              props.onSuccess(form.getFieldsValue())
              setOpen(false)
            })
            .finally(() => {
              setLoading(false)
            })
        }}
        open={open}
        title={title}
        onCancel={() => {
          setOpen(false)
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
          <Form.Item
            name={'name'}
            label={t('Field Name')}
            rules={[{ required: true }]}
          >
            <Input readOnly={isEdit}></Input>
          </Form.Item>
          <Form.Item
            name={'value'}
            label={t('Field Value')}
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={20}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Index
