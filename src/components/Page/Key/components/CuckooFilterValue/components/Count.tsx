import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import FieldInput from '@/components/InputJson'

const Count: React.FC<{
  keys: APP.CuckooFilterKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="CF.COUNT"
      width={500}
      documentUrl="https://redis.io/commands/cf.count/"
      trigger={<Button type="primary">COUNT</Button>}
      onQuery={async (v) => {
        const res = await request<number>(
          'cuckoo-filter/count',
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
export default Count
