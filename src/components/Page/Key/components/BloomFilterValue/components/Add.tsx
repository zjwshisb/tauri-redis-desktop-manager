import React from 'react'

import { Button, Form } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import FieldInput from '@/components/InputJson'

const Add: React.FC<{
  keys: APP.BloomFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      title={'BF.MADD'}
      documentUrl="https://redis.io/commands/bf.madd/"
      width={400}
      trigger={<Button type="primary">MADD</Button>}
      onSubmit={async (v) => {
        await request('bloom-filter/madd', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <FormListItem
        itemProps={{
          tooltip: 'is an item to add.'
        }}
        name="value"
        renderItem={({ key, name, ...restField }) => {
          return (
            <Form.Item
              {...restField}
              name={[name]}
              required={true}
              rules={[{ required: true }]}
            >
              <FieldInput />
            </Form.Item>
          )
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default Add
