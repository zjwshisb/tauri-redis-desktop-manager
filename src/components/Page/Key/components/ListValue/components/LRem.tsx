import { Form, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import CusInput from '@/components/CusInput'
import CusInputNumber from '@/components/CusInputNumber'

const LRem: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={400}
      documentUrl="https://redis.io/commands/lrem/"
      trigger={<Button type="primary">LREM</Button>}
      defaultValue={{
        name: props.keys.name
      }}
      onSubmit={async (v) => {
        await request<number>('list/lrem', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'LREM'}
    >
      <Form.Item name={'name'} label={'Key'} rules={[{ required: true }]}>
        <CusInput />
      </Form.Item>
      <Form.Item name={'value'} label={'Count'} rules={[{ required: true }]}>
        <CusInputNumber precision={0} />
      </Form.Item>
      <Form.Item name={'field'} label={'Element'} rules={[{ required: true }]}>
        <CusInput />
      </Form.Item>
    </ModalForm>
  )
}
export default LRem
