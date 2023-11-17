import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, Input } from 'antd'
import FormListItem from '@/components/FormListItem'

const SDiff: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SDIFF"
      width={400}
      defaultValue={{
        value: [keys.name, undefined]
      }}
      documentUrl="https://redis.io/commands/sdiff/"
      trigger={<Button type="primary">SDIFF</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/sdiff',
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
      <FormListItem
        name="value"
        itemProps={{
          label: 'Keys',
          required: true
        }}
        renderItem={({ name, ...restField }) => {
          return (
            <Form.Item
              {...restField}
              name={[name]}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          )
        }}
      ></FormListItem>
    </ModalQueryForm>
  )
}
export default SDiff
