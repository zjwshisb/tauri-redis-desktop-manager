import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import CusInput from '@/components/CusInput'
import CusInputNumber from '@/components/CusInputNumber'

const LPop: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalQueryForm
      title="LPOP"
      width={400}
      afterQueryClose={onSuccess}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/lpop/"
      trigger={<Button type="primary">LPOP</Button>}
      onQuery={async (v) => {
        const res = await request(
          'list/lpop',
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
      <Form.Item label={'Key'} name={'name'} rules={[{ required: true }]}>
        <CusInput />
      </Form.Item>
      <Form.Item label={'Count'} name={'value'}>
        <CusInputNumber min={0} />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default LPop
