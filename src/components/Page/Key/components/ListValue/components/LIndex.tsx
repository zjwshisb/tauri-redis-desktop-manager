import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, Input, InputNumber } from 'antd'

const LIndex: React.FC<{
  keys: APP.ListKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="LINDEX"
      width={400}
      documentUrl="https://redis.io/commands/lindex/"
      defaultValue={{
        name: keys.name
      }}
      trigger={<Button type="primary">LINDEX</Button>}
      onQuery={async (v) => {
        const res = await request(
          'list/lindex',
          keys.connection_id,
          {
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
      <Form.Item name={'name'} label={'Key'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={'value'} label={'Index'} rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default LIndex
