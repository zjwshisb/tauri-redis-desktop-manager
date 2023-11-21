import { Form, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import CusInput from '@/components/CusInput'

const RPopLPush: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="6.2.0" type="less" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/rpoplpush/"
        defaultValue={{
          source: props.keys.name
        }}
        trigger={<Button type="primary">RPOPLPUSH</Button>}
        onSubmit={async (v) => {
          await request<number>('list/rpoplpush', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'BRPOPLPUSH'}
      >
        <Form.Item
          name={'source'}
          label={'Source'}
          required
          rules={[{ required: true }]}
        >
          <CusInput />
        </Form.Item>
        <Form.Item
          name={'destination'}
          label={'Destination'}
          required
          rules={[{ required: true }]}
        >
          <CusInput />
        </Form.Item>
      </ModalForm>
    </VersionAccess>
  )
}
export default RPopLPush
