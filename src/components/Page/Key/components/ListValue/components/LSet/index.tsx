import { Form, Input, Modal, message, InputNumber } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import { EditOutlined } from '@ant-design/icons'
import { actionIconStyle } from '@/utils/styles'

const Index: React.FC<{
  keys: APP.ListKey
  index: number
  value: string
  onSuccess: (value: string, index: number) => void
}> = (props) => {
  const [open, setOpen] = React.useState(false)

  const [form] = useForm(undefined)

  const [loading, setLoading] = React.useState(false)

  return (
    <>
      <EditOutlined
        style={actionIconStyle}
        className="hover:cursor-pointer"
        onClick={() => {
          setOpen(true)
        }}
      />
      <Modal
        confirmLoading={loading}
        onOk={async () => {
          setLoading(true)
          const formData = form.getFieldsValue()
          await request<number>('key/list/lset', props.keys.connection_id, {
            name: props.keys.name,
            db: props.keys.db,
            ...formData
          })
            .then(() => {
              message.success('success')
              props.onSuccess(formData.value, formData.index)
              setOpen(false)
            })
            .finally(() => {
              setLoading(false)
            })
        }}
        open={open}
        title={'LSET'}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            index: props.index,
            value: props.value
          }}
        >
          <Form.Item name={'index'} label={'index'}>
            <InputNumber readOnly></InputNumber>
          </Form.Item>
          <Form.Item name={'value'} label={'value'}>
            <Input.TextArea rows={20}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Index
