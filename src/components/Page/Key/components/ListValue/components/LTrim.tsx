import { Form, InputNumber, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'

const Index: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      trigger={<Button type="primary">LTRIM</Button>}
      onSubmit={async (v) => {
        await request<number>('key/list/ltrim', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'LTRIM'}
    >
      <Form.Item
        name={'start'}
        label={'Start'}
        required
        rules={[{ required: true }]}
      >
        <InputNumber min={0}></InputNumber>
      </Form.Item>
      <Form.Item
        name={'stop'}
        label={'Stop'}
        required
        rules={[{ required: true }]}
      >
        <InputNumber min={0} max={props.keys.length - 1}></InputNumber>
      </Form.Item>
    </ModalForm>
  )
}
export default Index
