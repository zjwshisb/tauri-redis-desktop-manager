import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormListItem from '@/components/Form/FormListItem'
import { Form } from 'antd'
import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'

const ZDiffStore: React.FC<{
  keys: APP.ZSetKey
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="6.2.0">
      <ModalQueryForm
        defaultValue={{
          keys: [props.keys.name]
        }}
        width={500}
        documentUrl="https://redis.io/commands/zdiffstore/"
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/zdiffstore',
            props.keys.connection_id,
            {
              db: props.keys.db,
              ...v
            },
            {
              showNotice: false
            }
          )
          return res.data
        }}
        title={'ZDIFFSTORE'}
      >
        <FormInputItem label="Destination" name={'destination'} required />
        <Form.Item noStyle dependencies={['keys']}>
          {(f) => {
            const keys = f.getFieldValue('keys')
            if (keys !== undefined) {
              f.setFieldsValue({
                num_keys: keys.length
              })
            }
            return (
              <FormInputNumberItem
                label="Num keys"
                name="num_keys"
                required
                inputProps={{
                  min: 1,
                  precision: 0,
                  readOnly: true
                }}
              />
            )
          }}
        </Form.Item>
        <FormListItem
          name="keys"
          label="Keys"
          required
          renderItem={(field) => {
            return <FormInputItem {...field} required />
          }}
        ></FormListItem>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZDiffStore
