import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import FormInputItem from '@/components/Form/FormInputItem'
import BaseKeyForm from '../../BaseKeyForm'

const Add: React.FC<{
  keys: APP.HyperLogLogKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      defaultValue={{
        name: keys.name,
        value: [undefined]
      }}
      title={'PFADD'}
      documentUrl="https://redis.io/commands/pfadd/"
      width={400}
      onSubmit={async (v) => {
        await request('hyperloglog/pfadd', keys.connection_id, {
          db: keys.db,

          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <BaseKeyForm>
        <FormListItem
          name="value"
          label="Value"
          renderItem={(f) => {
            return <FormInputItem {...f} required />
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Add
