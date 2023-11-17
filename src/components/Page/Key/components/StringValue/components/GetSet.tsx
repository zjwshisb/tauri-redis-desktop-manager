import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, Input } from 'antd'

const GetSet: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalQueryForm
      title="GETSET"
      width={400}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/getset/"
      trigger={<Button type="primary">GETSET</Button>}
      afterQueryClose={onSuccess}
      onQuery={async (v) => {
        const res = await request<string>(
          'string/getset',
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
      <Form.Item label={'name'} name={'name'} rules={[{ required: true }]}>
        <Input readOnly />
      </Form.Item>
      <Form.Item label={'value'} name={'value'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default GetSet
