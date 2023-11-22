import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const AddNx: React.FC<{
  keys: APP.CuckooFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      title={'CF.ADDNX'}
      documentUrl="https://redis.io/commands/cf.addnx/"
      width={400}
      defaultValue={{
        name: keys.name
      }}
      onSubmit={async (v) => {
        await request('cuckoo-filter/addnx', keys.connection_id, {
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
export default AddNx
