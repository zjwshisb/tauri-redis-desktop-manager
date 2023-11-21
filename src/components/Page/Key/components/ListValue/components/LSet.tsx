import { Form } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FieldInput from '@/components/InputJson'
import ModalForm from '@/components/ModalForm'
import CusInput from '@/components/CusInput'
import CusInputNumber from '@/components/CusInputNumber'

const LSet: React.FC<{
  keys: APP.ListKey
  defaultValue: Record<string, any>
  onSuccess: (value: string, index: number) => void
  trigger: React.ReactElement
}> = (props) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/lset/"
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('list/lset', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess(v.value, v.index)
      }}
      title={'LSET'}
      defaultValue={props.defaultValue}
    >
      <Form.Item name={'name'} label={'Key'} rules={[{ required: true }]}>
        <CusInput />
      </Form.Item>
      <Form.Item name={'field'} label={'Index'} rules={[{ required: true }]}>
        <CusInputNumber />
      </Form.Item>
      <Form.Item name={'value'} label={'Value'} rules={[{ required: true }]}>
        <FieldInput></FieldInput>
      </Form.Item>
    </ModalForm>
  )
}
export default LSet
