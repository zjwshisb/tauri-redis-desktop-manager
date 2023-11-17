import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import FieldInput from '@/components/FieldInput'

const SIsMember: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SISMEMBER"
      width={400}
      documentUrl="https://redis.io/commands/sismember/"
      trigger={<Button type="primary">SISMEMBER</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/sismember',
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
      <Form.Item name={'value'} label={'item'} rules={[{ required: true }]}>
        <FieldInput />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default SIsMember
