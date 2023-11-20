import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, InputNumber } from 'antd'

const SPop: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalQueryForm
      title="SPOP"
      width={400}
      afterQueryClose={onSuccess}
      documentUrl="https://redis.io/commands/spop/"
      trigger={<Button type="primary">SPOP</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/spop',
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
      <Form.Item name={'value'} label={'Count'}>
        <InputNumber min={1} className="!w-full" />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default SPop
