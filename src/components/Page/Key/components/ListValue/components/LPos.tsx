import { Form, Input, Button, InputNumber } from 'antd'
import React from 'react'
import request from '@/utils/request'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import ModalQueryForm from '@/components/ModalQueryForm'

const LPos: React.FC<{
  keys: APP.ListKey
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="6.0.6" connection={connection}>
      <ModalQueryForm
        width={500}
        documentUrl="https://redis.io/commands/lpos/"
        defaultValue={{
          name: props.keys.name
        }}
        trigger={<Button type="primary">LPOS</Button>}
        onQuery={async (v) => {
          return await request<number>('list/lpos', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          }).then((r) => r.data)
        }}
        title={'LPOS'}
      >
        <Form.Item name={'name'} label={'Key'} rules={[{ required: true }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={'element'}
          label={'Element'}
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item name={'rank'} label={'Rank'}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name={'count'} label={'Count'}>
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item name={'len'} label={'MaxLen'}>
          <InputNumber></InputNumber>
        </Form.Item>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default LPos
