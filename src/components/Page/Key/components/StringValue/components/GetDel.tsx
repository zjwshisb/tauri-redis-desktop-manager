import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, Input } from 'antd'
import connectionContext from '../../../context'
import VersionAccess from '@/components/VersionAccess'

const GetDel: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="6.2.0">
      <ModalQueryForm
        title="GETDEL"
        width={400}
        defaultValue={{
          name: keys.name
        }}
        documentUrl="https://redis.io/commands/getdel/"
        trigger={<Button type="primary">GETDEL</Button>}
        afterQueryClose={onSuccess}
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
    </VersionAccess>
  )
}
export default GetDel
