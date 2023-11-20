import { Form, Input, Button, InputNumber } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormListItem from '@/components/FormListItem'

const BLPop: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess version="2.0.0" connection={connection}>
      <ModalForm
        width={500}
        documentUrl="https://redis.io/commands/blpop/"
        defaultValue={{
          name: [props.keys.name]
        }}
        trigger={<Button type="primary">BLPOP</Button>}
        onSubmit={async (v) => {
          await request<number>('list/blpop', props.keys.connection_id, {
            db: props.keys.db,
            ...v
          })
          props.onSuccess()
        }}
        title={'BLPOP'}
      >
        <FormListItem
          itemProps={{
            label: 'keys',
            required: true
          }}
          name="name"
          renderItem={(field) => {
            return (
              <Form.Item
                name={[field.name]}
                required
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            )
          }}
        ></FormListItem>
        <Form.Item name={'value'} label="Timeout" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
      </ModalForm>
    </VersionAccess>
  )
}
export default BLPop
