import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const RPush: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={500}
      documentUrl="https://redis.io/commands/rpush/"
      defaultValue={{
        name: props.keys.name,
        value: [undefined]
      }}
      onSubmit={async (v) => {
        await request<number>('list/rpush', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'RPUSH'}
    >
      <BaseKeyForm>
        <FormListItem
          name="value"
          label="Items"
          required
          renderItem={(f) => {
            return <FormInputJsonItem {...f} required />
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default RPush
