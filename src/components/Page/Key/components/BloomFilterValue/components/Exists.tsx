import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import FieldInput from '@/components/InputJson'

const Exists: React.FC<{
  keys: APP.BloomFilterKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="BF.EXISTS"
      width={500}
      documentUrl="https://redis.io/commands/bf.exists/"
      trigger={<Button type="primary">EXISTS</Button>}
      onQuery={async (v) => {
        const res = await request<number>(
          'bloom-filter/exists',
          keys.connection_id,
          {
            name: keys.name,
            db: keys.db,
            ...v
          }
        )
        return res.data
      }}
    >
      <Form.Item
        rules={[{ required: true }]}
        name={'value'}
        label="Item"
        tooltip="is an item to check."
      >
        <FieldInput />
      </Form.Item>
    </ModalQueryForm>
  )
}
export default Exists
