import { Form, InputNumber, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'

const LTrim: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={400}
      documentUrl="https://redis.io/commands/ltrim/"
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
        <InputNumber min={0} precision={0} className="!w-full"></InputNumber>
      </Form.Item>
      <Form.Item
        name={'stop'}
        label={'Stop'}
        required
        rules={[{ required: true }]}
      >
        <InputNumber
          min={0}
          className="!w-full"
          max={props.keys.length - 1}
          precision={0}
        ></InputNumber>
      </Form.Item>
    </ModalForm>
  )
}
export default LTrim
