import { Form, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'

const RPush: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      trigger={<Button type="primary">RPUSH</Button>}
      onSubmit={async (v) => {
        await request<number>('list/rpush', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          value: [v.value]
        })
        props.onSuccess()
      }}
      title={'RPUSH'}
    >
      <Form.Item
        name={'value'}
        label={'Value'}
        required
        rules={[{ required: true }]}
      >
        <FieldInput />
      </Form.Item>
    </ModalForm>
  )
}
export default RPush
