import { Form, Button, Input } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FieldInput from '@/components/InputJson'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'

const RPush: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={500}
      documentUrl="https://redis.io/commands/rpush/"
      trigger={<Button type="primary">RPUSH</Button>}
      defaultValue={{
        name: props.keys.name,
        value: [undefined]
      }}
      onSubmit={async (v) => {
        await request<number>('list/rpush', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'RPUSH'}
    >
      <Form.Item rules={[{ required: true }]} name={'name'} label={'Key'}>
        <Input />
      </Form.Item>
      <FormListItem
        name="value"
        renderItem={(f) => {
          return (
            <Form.Item name={[f.name]} rules={[{ required: true }]}>
              <FieldInput />
            </Form.Item>
          )
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default RPush
