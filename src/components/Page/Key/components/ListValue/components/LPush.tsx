import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormListItem from '@/components/Form/FormListItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const LPush: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={500}
      documentUrl="https://redis.io/commands/lpush/"
      defaultValue={{
        name: props.keys.name,
        value: [undefined]
      }}
      onSubmit={async (v) => {
        await request<number>('list/lpush', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'LPUSH'}
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
export default LPush
