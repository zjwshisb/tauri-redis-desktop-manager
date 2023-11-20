import { Form, Input } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FieldInput from '@/components/FieldInput'

const SMove: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
  trigger: React.ReactElement
  defaultValue?: Record<string, any>
}> = (props) => {
  return (
    <ModalForm
      width={600}
      documentUrl="https://redis.io/commands/smove/"
      defaultValue={props.defaultValue}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('set/smove', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'SMOVE'}
    >
      <Form.Item name={'name'} label="Source" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={'field'}
        label="Destination"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name={'value'} label="Member" rules={[{ required: true }]}>
        <FieldInput />
      </Form.Item>
    </ModalForm>
  )
}
export default SMove
