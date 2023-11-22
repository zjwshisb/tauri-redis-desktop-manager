import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const Add: React.FC<{
  keys: APP.CuckooFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      title={'CF.ADD'}
      documentUrl="https://redis.io/commands/cf.add/"
      defaultValue={{
        name: keys.name
      }}
      width={400}
      onSubmit={async (v) => {
        await request('cuckoo-filter/add', keys.connection_id, {
          db: keys.db,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <BaseKeyForm>
        <FormInputJsonItem name="value" label="Item" required />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Add
