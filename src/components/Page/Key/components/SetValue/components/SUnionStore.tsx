import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'

const SUnionStore: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/sunionstore/"
      defaultValue={{
        value: [keys.name, undefined]
      }}
      onSubmit={async (v) => {
        await request<number>('set/sunionstore', keys.connection_id, {
          db: keys.db,
          ...v
        })
      }}
      title={'SUNIONSTORE'}
    >
      <FormInputItem label={'Destination'} name={'name'} required />

      <FormListItem
        label="Keys"
        required
        name="value"
        renderItem={(field) => {
          return <FormInputItem {...field} required />
        }}
      ></FormListItem>
    </ModalForm>
  )
}
export default SUnionStore
