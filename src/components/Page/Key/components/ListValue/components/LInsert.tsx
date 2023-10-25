import { Form, Input, Button, Radio } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FieldInput from '@/components/FieldInput'
import ModalForm from '@/components/ModalForm'

const LInsert: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      defaultValue={{}}
      trigger={<Button type="primary">LINSERT</Button>}
      onSubmit={async (v) => {
        await request<number>('key/list/linsert', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db,
          types: 'BEFORE',
          ...v
        })
        props.onSuccess()
      }}
      title={'LINSERT'}
    >
      <Form.Item
        name={'pivot'}
        label={'Pivot'}
        required
        rules={[{ required: true }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item name={'types'} label={'Type'} rules={[{ required: true }]}>
        <Radio.Group
          optionType="button"
          options={[
            { label: 'BEFORE', value: 'BEFORE' },
            { label: 'AFTER', value: 'AFTER' }
          ]}
        ></Radio.Group>
      </Form.Item>
      <Form.Item
        name={'value'}
        label={'Value'}
        required
        rules={[{ required: true }]}
      >
        <FieldInput />
      </Form.Item>
    </ModalForm>
  )
}
export default LInsert
