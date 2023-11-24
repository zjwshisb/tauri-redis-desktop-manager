import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputItem from '@/components/Form/FormInputItem'

const HIncrByFloat: React.FC<{
  keys: APP.HashKey
  onSuccess: () => void
  trigger?: React.ReactElement
  defaultValue?: Record<string, any>
}> = ({ keys, onSuccess, defaultValue, trigger }) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/hincrbyfloat/"
      trigger={trigger}
      title="HINCRBYFLOAT"
      width={400}
      onSubmit={async (v) => {
        await request('hash/hincrbyfloat', keys.connection_id, {
          db: keys.db,
          ...v
        })
        onSuccess()
      }}
      defaultValue={{
        name: keys.name,
        ...defaultValue
      }}
    >
      <BaseKeyForm>
        <FormInputItem name="field" label="Field" required />
        <FormInputNumberItem
          name={'value'}
          label="Value"
          required
          inputProps={{ stringMode: true }}
        />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default HIncrByFloat
