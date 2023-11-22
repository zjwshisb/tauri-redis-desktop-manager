import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const Append: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/append/"
      title="APPEND"
      width={400}
      defaultValue={{
        name: keys.name
      }}
      onSubmit={async (v) => {
        await request(
          'string/append',
          keys.connection_id,
          {
            db: keys.db,

            ...v
          },
          { showNotice: false }
        )
        onSuccess()
      }}
    >
      <BaseKeyForm>
        <FormInputJsonItem name="value" label="Value" required />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Append
