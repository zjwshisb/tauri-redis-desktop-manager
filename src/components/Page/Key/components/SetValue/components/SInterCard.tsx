import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button, Form, Input, InputNumber } from 'antd'
import FormListItem from '@/components/FormListItem'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
const SInterCard: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="7.0.0">
      <ModalQueryForm
        title="SINTERCARD"
        width={400}
        defaultValue={{
          keys: [keys.name, undefined]
        }}
        documentUrl="https://redis.io/commands/sintercard/"
        trigger={<Button type="primary">SINTERCARD</Button>}
        onQuery={async (v) => {
          const res = await request(
            'set/sintercard',
            keys.connection_id,
            {
              db: keys.db,
              ...v
            },
            {
              showNotice: false
            }
          )
          return res.data
        }}
      >
        <Form.Item
          name={'numkeys'}
          label={'numkeys'}
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <FormListItem
          name="keys"
          itemProps={{
            label: 'Keys',
            required: true
          }}
          renderItem={({ name, ...restField }) => {
            return (
              <Form.Item
                {...restField}
                name={[name]}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            )
          }}
        ></FormListItem>
        <Form.Item name={'limit'} label={'limit'}>
          <InputNumber />
        </Form.Item>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default SInterCard
