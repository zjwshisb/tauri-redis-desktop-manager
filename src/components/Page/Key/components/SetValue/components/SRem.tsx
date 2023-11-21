import { Form, Input } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

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
      <Form.Item name={'name'} label="Key" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <FormListItem
        label="Members"
        required
        name="value"
        renderItem={(field) => {
          return <FormInputJsonItem {...field} required />
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default SRem
