import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import CusInput from '@/components/CusInput'

const LLen: React.FC<{
  keys: APP.ListKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="LLEN"
      width={400}
      queryWithOpen
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/llen/"
      trigger={<Button type="primary">LLEN</Button>}
      onQuery={async (v) => {
        const res = await request(
          'list/llen',
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
        <CusInput />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default LLen
