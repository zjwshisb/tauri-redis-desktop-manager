import { Form, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import CusInput from '@/components/CusInput'
import CusInputNumber from '@/components/CusInputNumber'

const LTrim: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={400}
      documentUrl="https://redis.io/commands/ltrim/"
      defaultValue={{
        name: props.keys.name
      }}
      trigger={<Button type="primary">LTRIM</Button>}
      onSubmit={async (v) => {
        await request<number>('list/ltrim', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'LTRIM'}
    >
      <Form.Item name={'name'} label="Key" rules={[{ required: true }]}>
        <CusInput />
      </Form.Item>
      <Form.Item
        name={'start'}
        label={'Start'}
        required
        rules={[{ required: true }]}
      >
        <CusInputNumber min={0} precision={0} />
      </Form.Item>
      <Form.Item
        name={'end'}
        label={'Stop'}
        required
        rules={[{ required: true }]}
      >
        <CusInputNumber
          min={0}
          max={props.keys.length - 1}
          precision={0}
        ></CusInputNumber>
      </Form.Item>
    </ModalForm>
  )
}
export default LTrim
