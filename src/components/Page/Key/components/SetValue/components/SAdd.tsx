import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const SAdd: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/sadd/"
      defaultValue={{
        value: [undefined],
        name: props.keys.name
      }}
      onSubmit={async (v) => {
        await request<number>('set/sadd', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'SADD'}
    >
      <BaseKeyForm>
        <FormListItem
          label="Items"
          required
          name="value"
          renderItem={(field) => {
            return <FormInputJsonItem {...field} required />
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default SAdd
