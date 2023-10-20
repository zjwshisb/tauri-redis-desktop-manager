import { Form, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'

const LPush: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      trigger={<Button type="primary">LPUSH</Button>}
      onSubmit={async (v) => {
        await request<number>('key/list/lpush', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          value: [v.value]
        })
        props.onSuccess()
      }}
      title={'LPUSH'}
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
export default LPush
