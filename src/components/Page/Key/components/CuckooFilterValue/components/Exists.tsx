import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import FieldInput from '@/components/InputJson'

const Exists: React.FC<{
  keys: APP.CuckooFilterKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="CF.EXISTS"
      width={500}
      documentUrl="https://redis.io/commands/cf.exists/"
      trigger={<Button type="primary">EXISTS</Button>}
      onQuery={async (v) => {
        const res = await request<number>(
          'cuckoo-filter/exists',
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
      <Form.Item
        rules={[{ required: true }]}
        name={'value'}
        label="Item"
        tooltip="Is an item to check."
      >
        <FieldInput />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default Exists
