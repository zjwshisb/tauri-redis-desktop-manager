import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const SetRange: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      width={400}
      documentUrl="https://redis.io/commands/setrange/"
      defaultValue={{
        name: keys.name
      }}
      title="SETRANGE"
      onSubmit={async (v) => {
        await request('string/setrange', keys.connection_id, {
          db: keys.db,
          ...v
        })
        onSuccess()
      }}
    >
      <BaseKeyForm>
        <FormInputNumberItem
          name="field"
          label="Offset"
          required
          inputProps={{
            precision: 0,
            min: 0
          }}
        />
        <FormInputJsonItem name="value" label="Value" required />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default SetRange
