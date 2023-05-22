import { Form, Input, Modal, message } from 'antd'
import React from 'react'
import { EditOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import { blue } from '@ant-design/colors'
import { actionIconStyle } from '@/utils/styles'

const Index: React.FC<{
  keys: APP.HashKey
  field: APP.Field
  onSuccess: (newField: APP.Field) => void
}> = (props) => {
  const [open, setOpen] = React.useState(false)

  const [form] = useForm(undefined)

  const [loading, setLoading] = React.useState(false)

  return <>
      <EditOutlined
       style={actionIconStyle}
       className='hover:cursor-pointer blue-6' key={'edit'} onClick={() => {
         setOpen(true)
       }} />
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
       open={open} title={'edit'} onCancel={() => {
         setOpen(false)
       }}>
        <Form
          form={form}
        layout='vertical' initialValues={{
          ...props.field
        }}>
          <Form.Item name={'name'} label={'name'}>
            <Input readOnly></Input>
          </Form.Item>
          <Form.Item name={'value'} label={'value'}>
            <Input.TextArea rows={20}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>
}
export default Index
