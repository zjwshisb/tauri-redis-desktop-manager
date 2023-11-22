import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const LSet: React.FC<{
  keys: APP.ListKey
  defaultValue: Record<string, any>
  onSuccess: (value: string, index: number) => void
  trigger: React.ReactElement
}> = (props) => {
  return (
    <ModalForm
      documentUrl="https://redis.io/commands/lset/"
      trigger={props.trigger}
      onSubmit={async (v) => {
        await request<number>('list/lset', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess(v.value, v.index)
      }}
      title={'LSET'}
      defaultValue={props.defaultValue}
    >
      <BaseKeyForm>
        <FormInputNumberItem
          name={'field'}
          label={'Index'}
          required
          inputProps={{ precision: 0 }}
        />
        <FormInputJsonItem name={'value'} label={'Value'} required />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default LSet
