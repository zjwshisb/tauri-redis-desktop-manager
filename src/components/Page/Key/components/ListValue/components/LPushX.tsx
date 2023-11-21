import { Form, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import FieldInput from '@/components/InputJson'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import connectionContext from '../../../context'
import VersionAccess from '@/components/VersionAccess'
import CusInput from '@/components/CusInput'

const LPushX: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="2.2.0">
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/lpushx/"
        trigger={<Button type="primary">LPUSHX</Button>}
        defaultValue={{
          name: props.keys.name,
          value: [undefined]
        }}
        onSubmit={async (v) => {
          await request<number>('list/lpushx', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'LPUSHX'}
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
    </VersionAccess>
  )
}
export default LPushX
