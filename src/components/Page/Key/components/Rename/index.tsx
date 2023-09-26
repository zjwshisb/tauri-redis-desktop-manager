import { Form, Input } from 'antd'
import React from 'react'
import { useForm } from 'antd/es/form/Form'
import request from '@/utils/request'
import CusModal from '@/components/CusModal'

const Rename: React.FC<{
  keys: APP.Key
  trigger: React.ReactElement
  onSuccess: (name: string) => void
}> = (props) => {
  const [form] = useForm()

  return (
    <CusModal
      width={'800px'}
      trigger={props.trigger}
      onOk={async () => {
        const newName: string = form.getFieldValue('name')
        await request<number>('key/rename', props.keys.connection_id, {
          name: props.keys.name,
          new_name: newName,
          db: props.keys.db
        }).then(() => {
          props.onSuccess(newName)
        })
      }}
      title={'RENAME'}
      onCancel={() => {
        form.resetFields()
      }}
    >
      <Form
        form={form}
        initialValues={{
          name: props.keys.name
        }}
      >
        <Form.Item name={'name'} label={'Name'} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </CusModal>
  )
}
export default Rename
