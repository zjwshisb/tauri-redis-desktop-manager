import { Form, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FieldInput from '@/components/InputJson'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import CusInput from '@/components/CusInput'

const LPush: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={500}
      documentUrl="https://redis.io/commands/lpush/"
      trigger={<Button type="primary">LPUSH</Button>}
      defaultValue={{
        name: props.keys.name,
        value: [undefined]
      }}
      onSubmit={async (v) => {
        await request<number>('list/lpush', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'LPUSH'}
    >
      <Form.Item rules={[{ required: true }]} name={'name'} label={'Key'}>
        <CusInput />
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
export default LPush
