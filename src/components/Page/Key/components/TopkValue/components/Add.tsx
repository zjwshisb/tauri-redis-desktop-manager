import React from 'react'

import request from '@/utils/request'
import ModalForm from '@/components/ModalForm'
import FormTextareaItem from '@/components/Form/FormTextAreaItem'
import BaseKeyForm from '../../BaseKeyForm'

const Add: React.FC<{
  keys: APP.TopKKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      width={500}
      documentUrl="https://redis.io/commands/topk.add/"
      title="TOPK.ADD"
      defaultValue={{
        name: keys.name
      }}
      onSubmit={async (v) => {
        await request('topk/add', keys.connection_id, {
          db: keys.db,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <BaseKeyForm>
        <FormTextareaItem name={'value'} label="Value"></FormTextareaItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Add
