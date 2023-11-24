import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const HSetNx: React.FC<{
  keys: APP.HashKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      title={'HSETNX'}
      documentUrl="https://redis.io/commands/hsetnx/"
      width={800}
      defaultValue={{
        name: props.keys.name
      }}
      onSubmit={async (v) => {
        await request<number>('hash/hsetnx', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        }).then(() => {
          props.onSuccess()
        })
      }}
    >
      <BaseKeyForm>
        <FormInputItem label="Field" name={'field'} required />
        <FormInputJsonItem label="Value" name={'value'} required />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default HSetNx
