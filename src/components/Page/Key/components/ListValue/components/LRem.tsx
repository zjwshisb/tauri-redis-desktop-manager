import { Form, InputNumber, Button, Input } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'

const LRem: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={400}
      documentUrl="https://redis.io/commands/lrem/"
      trigger={<Button type="primary">LREM</Button>}
      defaultValue={{
        name: props.keys.name
      }}
      onSubmit={async (v) => {
        await request<number>('list/lrem', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'LREM'}
    >
      <Form.Item name={'name'} label={'Key'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={'value'} label={'Count'} rules={[{ required: true }]}>
        <InputNumber className="!w-full" precision={0}></InputNumber>
      </Form.Item>
      <Form.Item name={'field'} label={'Element'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </ModalForm>
  )
}
export default LRem
