import { Form, Input, Modal, message, Button } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'

const Index: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
}> = (props) => {
  const [open, setOpen] = React.useState(false)

  const [form] = useForm(undefined)

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [form, open])

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true)
        }}
      >
        SADD
      </Button>
      <Modal
        confirmLoading={loading}
        onOk={async () => {
          form.validateFields().then((formData) => {
            setLoading(true)
            request<number>('key/set/sadd', props.keys.connection_id, {
              name: props.keys.name,
              db: props.keys.db,
              ...formData
            })
              .then(() => {
                message.success('success')
                props.onSuccess()
                setOpen(false)
              })
              .finally(() => {
                setLoading(false)
              })
          })
        }}
        open={open}
        title={'Insert'}
        onCancel={() => {
          setOpen(false)
        }}
      >
        <Form form={form} layout="vertical" initialValues={{}}>
          <Form.Item
            name={'value'}
            label={'value'}
            required
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
