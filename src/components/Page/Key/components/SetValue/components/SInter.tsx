import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, Input } from 'antd'
import FormListItem from '@/components/FormListItem'

const SInter: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SINTER"
      width={400}
      defaultValue={{
        value: [keys.name, undefined]
      }}
      documentUrl="https://redis.io/commands/sinter/"
      trigger={<Button type="primary">SINTER</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/sinter',
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
export default SInter
