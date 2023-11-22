import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

const InsertNx: React.FC<{
  keys: APP.CuckooFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      defaultValue={{
        name: keys.name,
        value: [undefined]
      }}
      title={'CF.INSERTNX'}
      documentUrl="https://redis.io/commands/cf.insertnx/"
      width={400}
      onSubmit={async (v) => {
        await request('cuckoo-filter/insertnx', keys.connection_id, {
          db: keys.db,

          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <BaseKeyForm>
        <FormListItem
          tooltip="is an item to add."
          label="Item"
          required
          name="value"
          renderItem={(f) => {
            return <FormInputJsonItem {...f} required></FormInputJsonItem>
          }}
        />
      </BaseKeyForm>
    </ModalForm>
  )
}
export default InsertNx
