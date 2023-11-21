import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import CusInput from '@/components/CusInput'
import CusInputNumber from '@/components/CusInputNumber'

const LRange: React.FC<{
  keys: APP.ListKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="LRANGE"
      width={400}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/lrange/"
      trigger={<Button type="primary">LRANGE</Button>}
      onQuery={async (v) => {
        const res = await request(
          'list/lrange',
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
      <Form.Item name={'start'} label={'Start'} rules={[{ required: true }]}>
        <CusInputNumber />
      </Form.Item>
      <Form.Item name={'end'} label={'Stop'} rules={[{ required: true }]}>
        <CusInputNumber />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default LRange
