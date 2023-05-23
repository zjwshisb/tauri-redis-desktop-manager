import { Form, Input, Modal, message } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'

const Index: React.FC<{
  keys: APP.Key
  trigger: React.ReactElement
  onSuccess: (name: string) => void
}> = (props) => {
  const [open, setOpen] = React.useState(false)

  const [form] = useForm(undefined)

  const [loading, setLoading] = React.useState(false)

  const trigger = React.cloneElement(props.trigger, {
    onClick () {
      setOpen(true)
    }
  })

  return <>
      {
        trigger
      }
      <Modal
        width={'800px'}
        confirmLoading={loading}
        onOk={() => {
          setLoading(true)
          const newName: string = form.getFieldValue('name')
          return request<number>('key/rename', props.keys.connection_id, {
            name: props.keys.name,
            new_name: newName,
            db: props.keys.db
          }).then(() => {
            message.success('success')
            props.onSuccess(newName)
            setOpen(false)
          }).finally(() => {
            setLoading(false)
          })
        }}
        open={open} title={'RENAME'}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}>
        <Form
          form={form}
           initialValues={{
             name: props.keys.name
           }}>
          <Form.Item name={'name'} label={'name'}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
}
export default Index
