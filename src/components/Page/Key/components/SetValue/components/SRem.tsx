import { Form } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FieldInput from '@/components/FieldInput'
import FormListItem from '@/components/FormListItem'

const SRem: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
  trigger: React.ReactElement
  defaultValue?: Record<string, any>
}> = (props) => {
  return (
    <ModalForm
      width={600}
      documentUrl="https://redis.io/commands/srem/"
      defaultValue={props.defaultValue}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('set/srem', props.keys.connection_id, {
          db: props.keys.db,
          name: props.keys.name,
          ...v
        })
        props.onSuccess()
      }}
      title={'SREM'}
    >
      <FormListItem
        itemProps={{
          label: 'Members',
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
    </ModalForm>
  )
}
export default SRem
