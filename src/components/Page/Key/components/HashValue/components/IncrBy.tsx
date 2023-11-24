import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputItem from '@/components/Form/FormInputItem'

const HIncrBy: React.FC<{
  keys: APP.HashKey
  onSuccess: () => void
  trigger?: React.ReactElement
  defaultValue?: Record<string, any>
}> = ({ keys, onSuccess, defaultValue, trigger }) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/hincrby/"
      trigger={trigger}
      title="HINCRBY"
      width={400}
      onSubmit={async (v) => {
        await request('hash/hincrby', keys.connection_id, {
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
          inputProps={{ precision: 0 }}
        />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default HIncrBy
