import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

const IncrBy: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/incrby/"
      title="INCRBY"
      width={400}
      onSubmit={async (v) => {
        await request('string/incrby', keys.connection_id, {
          db: keys.db,
          ...v
        })
        onSuccess()
      }}
      defaultValue={{
        name: keys.name
      }}
    >
      <FormInputItem name="name" label="Key" required />
      <FormInputNumberItem
        name={'value'}
        label="Value"
        required
        inputProps={{ precision: 0 }}
      />
    </ModalForm>
  )
}
export default IncrBy
