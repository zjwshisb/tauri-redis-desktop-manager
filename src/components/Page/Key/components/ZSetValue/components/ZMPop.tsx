import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormListItem from '@/components/Form/FormListItem'
import { Form } from 'antd'
import FormSelectItem from '@/components/Form/FormSelectItem'
import ModalQueryForm from '@/components/ModalQueryForm'
import VersionAccess from '@/components/VersionAccess'
import connectionContext from '../../../context'
import FormInputItem from '@/components/Form/FormInputItem'

const ZMPop: React.FC<{
  keys: APP.ZSetKey
  onSuccess: () => void
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="7.0.0">
      <ModalQueryForm
        defaultValue={{
          keys: [props.keys.name]
        }}
        width={500}
        documentUrl="https://redis.io/commands/zmpop/"
        afterQueryClose={props.onSuccess}
        onQuery={async (v) => {
          const res = await request<number>(
            'zset/zmpop',
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
        title={'ZMPOP'}
      >
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
        <FormSelectItem
          label="Option"
          name={'option'}
          required
          inputProps={{
            options: [
              {
                label: 'MIN',
                value: 'MIN'
              },
              {
                label: 'MAX',
                value: 'MAx'
              }
            ]
          }}
        ></FormSelectItem>
        <FormInputNumberItem
          label="Count"
          name={'count'}
          inputProps={{
            precision: 0
          }}
        ></FormInputNumberItem>
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZMPop
