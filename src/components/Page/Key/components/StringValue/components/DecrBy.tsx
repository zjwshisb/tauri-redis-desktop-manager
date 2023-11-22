import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const DecrBy: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/decrby/"
      title="DECRBY"
      width={400}
      defaultValue={{
        name: keys.name
      }}
      onSubmit={async (v) => {
        await request('string/decrby', keys.connection_id, {
          db: keys.db,
          ...v
        })
        onSuccess()
      }}
    >
      <BaseKeyForm>
        <FormInputNumberItem
          name={'value'}
          required
          inputProps={{
            precision: 0
          }}
        />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default DecrBy
