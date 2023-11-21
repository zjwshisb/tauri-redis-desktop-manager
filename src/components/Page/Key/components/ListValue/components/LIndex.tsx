import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import CusInput from '@/components/CusInput'
import CusInputNumber from '@/components/CusInputNumber'

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
        <CusInput />
      </Form.Item>
      <Form.Item name={'value'} label={'Index'} rules={[{ required: true }]}>
        <CusInputNumber />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default LIndex
