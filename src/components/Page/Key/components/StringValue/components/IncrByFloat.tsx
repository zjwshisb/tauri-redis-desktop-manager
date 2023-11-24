import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import VersionAccess from '@/components/VersionAccess'
import context from '../../../context'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'
const IncrByFloat: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const connection = React.useContext(context)

  return (
    <VersionAccess connection={connection} version="2.6.0">
      <ModalForm
        documentUrl="https://redis.io/commands/incrbyfloat/"
        title="INCRBYFLOAT"
        defaultValue={{
          name: keys.name
        }}
        width={400}
        onSubmit={async (v) => {
          await request('string/incrbyfloat', keys.connection_id, {
            db: keys.db,
            ...v
          })
          onSuccess()
        }}
      >
        <BaseKeyForm>
          <FormInputNumberItem name={'value'} label="Value" required />
        </BaseKeyForm>
      </ModalForm>
    </VersionAccess>
  )
}
export default IncrByFloat
