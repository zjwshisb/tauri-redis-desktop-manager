import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, InputNumber } from 'antd'

const GetRange: React.FC<{
  keys: APP.StringKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="GETRANGE"
      width={400}
      documentUrl="https://redis.io/commands/getrange/"
      trigger={<Button type="primary">GETRANGE</Button>}
      onQuery={async (v) => {
        const res = await request<string>(
          'string/getrange',
          keys.connection_id,
          {
            name: keys.name,
            db: keys.db,
            ...v
          },
          {
            showNotice: false
          }
        )
        return res.data
      }}
    >
      <Form.Item rules={[{ required: true }]} name={'start'} label="start">
        <InputNumber className="!w-full"></InputNumber>
      </Form.Item>
      <Form.Item rules={[{ required: true }]} name={'end'} label="end">
        <InputNumber className="!w-full"></InputNumber>
      </Form.Item>
    </ModalQueryForm>
  )
}
export default GetRange
