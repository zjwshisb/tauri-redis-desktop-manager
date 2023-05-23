import { Form, Input, Modal, message } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'

const Index: React.FC<{
  keys: APP.HashKey
  field?: APP.Field
  trigger: React.ReactElement
  onSuccess: (newField: APP.Field) => void
}> = (props) => {
  const [open, setOpen] = React.useState(false)

  const [form] = useForm(undefined)

  const [loading, setLoading] = React.useState(false)

  const title = React.useMemo(() => {
    return (props.field != null) ? 'edit field' : 'add field'
  }, [props.field])

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
      confirmLoading={loading}
      onOk={() => {
        setLoading(true)
        return request<number>('key/hash/hset', props.keys.connection_id, {
          name: props.keys.name,
          field: form.getFieldValue('name'),
          value: form.getFieldValue('value'),
          db: props.keys.db
        }).then(() => {
          message.success('success')
          props.onSuccess(form.getFieldsValue())
          setOpen(false)
        }).finally(() => {
          setLoading(false)
        })
      }}
       open={open} title={title}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}>
        <Form
          form={form}
        layout='vertical' initialValues={{
          ...props.field
        }}>
          <Form.Item name={'name'} label={'name'}>
            <Input readOnly={!(props.field == null)}></Input>
          </Form.Item>
          <Form.Item name={'value'} label={'value'}>
            <Input.TextArea rows={20}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>
}
export default Index
