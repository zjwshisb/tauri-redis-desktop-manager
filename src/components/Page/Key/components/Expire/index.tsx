import { Form, InputNumber, Modal, message } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'

const Index: React.FC<{
  keys: APP.Key
  trigger: React.ReactElement
  onSuccess: (ttl: number) => void
}> = (props) => {
  const [open, setOpen] = React.useState(false)

  const [form] = useForm(undefined)

  const [loading, setLoading] = React.useState(false)

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
        onOk={() => {
          setLoading(true)
          const ttl: number = form.getFieldValue('ttl')
          request<number>('key/expire', props.keys.connection_id, {
            name: props.keys.name,
            ttl,
            db: props.keys.db
          })
            .then(() => {
              message.success('success')
              props.onSuccess(ttl)
              setOpen(false)
            })
            .finally(() => {
              setLoading(false)
            })
        }}
        open={open}
        title={'EXPIRE'}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
      >
        <Form
          form={form}
          initialValues={{
            ttl: props.keys.ttl
          }}
        >
          <Form.Item name={'ttl'} label={'ttl'}>
            <InputNumber min={-1}></InputNumber>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Index
