import { Form, Modal, message, InputNumber, Button } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'

const Index: React.FC<{
  keys: APP.ListKey
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
        LTRIM
      </Button>
      <Modal
        confirmLoading={loading}
        onOk={async () => {
          form.validateFields().then((formData) => {
            setLoading(true)
            request<number>('key/list/ltrim', props.keys.connection_id, {
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
        title={'LTRIM'}
        onCancel={() => {
          setOpen(false)
        }}
      >
        <Form form={form} layout="horizontal" initialValues={{}}>
          <Form.Item
            name={'start'}
            label={'Start'}
            required
            rules={[{ required: true }]}
          >
            <InputNumber min={0}></InputNumber>
          </Form.Item>
          <Form.Item
            name={'stop'}
            label={'Stop'}
            required
            rules={[{ required: true }]}
          >
            <InputNumber min={0}></InputNumber>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Index
