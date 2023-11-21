import { Form, Button, Radio } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FieldInput from '@/components/InputJson'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import CusInput from '@/components/CusInput'

const LInsert: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)
  return (
    <VersionAccess connection={connection} version="2.2.0">
      <ModalForm
        width={400}
        documentUrl="https://redis.io/commands/linsert/"
        defaultValue={{
          name: props.keys.name
        }}
        trigger={<Button type="primary">LINSERT</Button>}
        onSubmit={async (v) => {
          await request<number>('list/linsert', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'LINSERT'}
      >
        <Form.Item
          name={'name'}
          label={'Key'}
          required
          rules={[{ required: true }]}
        >
          <CusInput />
        </Form.Item>
        <Form.Item
          name={'pivot'}
          label={'Pivot'}
          required
          rules={[{ required: true }]}
        >
          <CusInput />
        </Form.Item>
        <Form.Item
          name={'whereto'}
          label={'Whereto'}
          rules={[{ required: true }]}
        >
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
    </VersionAccess>
  )
}
export default LInsert
