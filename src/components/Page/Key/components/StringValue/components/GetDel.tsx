import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, Input } from 'antd'

const GetDel: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  return (
    <ModalQueryForm
      title="GETDEL"
      width={400}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/getdel/"
      trigger={<Button type="primary">GETDEL</Button>}
      onSuccess={onRefresh}
      onQuery={async (v) => {
        const res = await request<string>(
          'string/getdel',
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
      <Form.Item label={'key'} name={'name'} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default GetDel
