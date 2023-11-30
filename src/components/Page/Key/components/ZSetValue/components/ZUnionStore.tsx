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

const ZUnionStore: React.FC<{
  keys: APP.ZSetKey
}> = (props) => {
  const connection = React.useContext(connectionContext)

  return (
    <VersionAccess connection={connection} version="2.0.0">
      <ModalQueryForm
        defaultValue={{
          keys: [props.keys.name]
        }}
        width={500}
        documentUrl="https://redis.io/commands/zunionstore/"
        onQuery={async (v) => {
          const weights = v.weights.filter((v: any) => v != null)
          const res = await request<number>(
            'zset/zunionstore',
            props.keys.connection_id,
            {
              db: props.keys.db,
              ...v,
              weights: weights.length > 0 ? weights : undefined
            },
            {
              showNotice: false
            }
          )
          return res.data
        }}
        title={'ZUNIONSTORE'}
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
        <Form.Item noStyle dependencies={['keys']}>
          {(f) => {
            const keys = f.getFieldValue('keys')
            if (keys !== undefined) {
              f.setFieldsValue({
                weights: Array.from({ length: keys.length }, () => undefined)
              })
            }
            return (
              <FormListItem
                name="weights"
                showAdd={false}
                showRemove={false}
                label="Weights"
                renderItem={(field) => {
                  return (
                    <FormInputNumberItem
                      {...field}
                      inputProps={{
                        stringMode: true
                      }}
                    />
                  )
                }}
              ></FormListItem>
            )
          }}
        </Form.Item>

        <FormSelectItem
          label="Aggregate"
          name={'aggregate'}
          inputProps={{
            options: [
              {
                label: 'SUM',
                value: 'SUM'
              },
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
      </ModalQueryForm>
    </VersionAccess>
  )
}
export default ZUnionStore
