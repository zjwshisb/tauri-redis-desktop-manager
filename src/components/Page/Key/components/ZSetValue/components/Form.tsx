import { Form, Input, Modal, message, InputNumber } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  keys: APP.ZSetKey
  field?: APP.ZSetField
  onSuccess: () => void
  trigger: React.ReactElement
}> = (props) => {
  const [open, setOpen] = React.useState(false)

  const [form] = useForm(undefined)

  const { t } = useTranslation()

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [form, open])

  const trigger = React.cloneElement(props.trigger, {
    onClick() {
      setOpen(true)
    }
  })

  React.useEffect(() => {
    if (props.field != null && open) {
      form.setFieldsValue({
        value: props.field.value,
        score: props.field.score
      })
    }
  }, [form, open, props.field])

  return (
    <>
      {trigger}
      <Modal
        confirmLoading={loading}
        onOk={async () => {
          form.validateFields().then((formData) => {
            setLoading(true)

            request<number>('key/zset/zadd', props.keys.connection_id, {
              name: props.keys.name,
              db: props.keys.db,
              value: formData.value,
              score: parseFloat(formData.score)
            })
              .then(() => {
                message.success(t('Success'))
                props.onSuccess()
                setOpen(false)
              })
              .finally(() => {
                setLoading(false)
              })
          })
        }}
        open={open}
        title={'ZADD'}
        onCancel={() => {
          setOpen(false)
        }}
      >
        <Form form={form} layout="vertical" initialValues={{}}>
          <Form.Item
            name={'value'}
            label={t('Value')}
            required
            rules={[{ required: true }]}
          >
            <Input
              readOnly={props.field != null}
              placeholder={t('Please Enter {{name}}', {
                name: t('Value')
              }).toString()}
            ></Input>
          </Form.Item>
          <Form.Item
            name={'score'}
            label={t('Score')}
            required
            rules={[{ required: true }]}
          >
            <InputNumber
              placeholder={t('Please Enter {{name}}', {
                name: t('Score')
              }).toString()}
            ></InputNumber>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Index
