import React from 'react'
import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'

import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const LRem: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ModalForm
      width={400}
      documentUrl="https://redis.io/commands/lrem/"
      defaultValue={{
        name: props.keys.name
      }}
      onSubmit={async (v) => {
        await request<number>('list/lrem', props.keys.connection_id, {
          db: props.keys.db,
          ...v
        })
        props.onSuccess()
      }}
      title={'LREM'}
    >
      <BaseKeyForm>
        <FormInputNumberItem
          name={'value'}
          label={'Count'}
          required
          inputProps={{ precision: 0 }}
        />
        <FormInputJsonItem name={'field'} label={'Element'} required />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default LRem
