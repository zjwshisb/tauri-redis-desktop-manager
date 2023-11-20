import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form } from 'antd'
import FieldInput from '@/components/FieldInput'
import FormListItem from '@/components/FormListItem'

const SMIsMember: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SMISMEMBER"
      width={400}
      defaultValue={{
        value: [undefined]
      }}
      documentUrl="https://redis.io/commands/smismember/"
      trigger={<Button type="primary">SMISMEMBER</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/smismember',
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
      <FormListItem
        itemProps={{
          label: 'Member',
          required: true
        }}
        name="value"
        renderItem={(field) => {
          return (
            <Form.Item
              name={[field.name]}
              required
              rules={[{ required: true }]}
            >
              <FieldInput />
            </Form.Item>
          )
        }}
      ></FormListItem>
    </ModalQueryForm>
  )
}
export default SMIsMember
