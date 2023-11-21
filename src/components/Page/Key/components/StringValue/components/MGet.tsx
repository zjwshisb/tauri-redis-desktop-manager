import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, Input } from 'antd'
import FormListItem from '@/components/Form/FormListItem'

const MGet: React.FC<{
  keys: APP.StringKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="MGET"
      width={400}
      defaultValue={{
        name: [keys.name]
      }}
      documentUrl="https://redis.io/commands/mget/"
      trigger={<Button type="primary">MGET</Button>}
      onQuery={async (v) => {
        const res = await request<string>(
          'string/mget',
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
        name="name"
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
export default MGet
