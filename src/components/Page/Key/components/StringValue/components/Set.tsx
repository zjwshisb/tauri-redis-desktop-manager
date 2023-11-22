import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const Set: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/set/"
      title="SET"
      onSubmit={async (v) => {
        await request('string/set', keys.connection_id, {
          db: keys.db,
          ...v
        })
        onSuccess()
      }}
      defaultValue={{
        name: keys.name,
        value: keys.data
      }}
    >
      <BaseKeyForm>
        <FormInputJsonItem name="value" label="Value" required />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Set
