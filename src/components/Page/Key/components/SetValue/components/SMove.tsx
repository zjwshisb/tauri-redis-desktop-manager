import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

const SMove: React.FC<{
  keys: APP.SetKey
  onSuccess: () => void
  trigger: React.ReactElement
  defaultValue?: Record<string, any>
}> = (props) => {
  return (
    <ModalForm
      width={600}
      documentUrl="https://redis.io/commands/smove/"
      defaultValue={props.defaultValue}
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('set/smove', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'SMOVE'}
    >
      <FormInputItem name={'name'} label="Source" required />
      <FormInputItem name={'field'} label="Destination" required />
      <FormInputJsonItem name={'value'} label="Member" required />
    </ModalForm>
  )
}
export default SMove
