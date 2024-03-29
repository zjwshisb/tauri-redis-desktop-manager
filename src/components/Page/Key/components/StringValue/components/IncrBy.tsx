import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

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
      <BaseKeyForm>
        <FormInputNumberItem
          name={'value'}
          label="Value"
          required
          inputProps={{ precision: 0 }}
        />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default IncrBy
