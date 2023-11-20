import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, InputNumber } from 'antd'

const SRandMember: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SRANDMEMBER"
      width={400}
      documentUrl="https://redis.io/commands/srandmember/"
      trigger={<Button type="primary">SRANDMEMBER</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/srandmember',
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
        <InputNumber className="!w-full" />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default SRandMember
