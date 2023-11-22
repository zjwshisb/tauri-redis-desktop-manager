import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

const Insert: React.FC<{
  keys: APP.CuckooFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      defaultValue={{
        name: keys.name,
        value: [undefined]
      }}
      title={'CF.INSERT'}
      documentUrl="https://redis.io/commands/cf.insert/"
      width={400}
      onSubmit={async (v) => {
        await request('cuckoo-filter/insert', keys.connection_id, {
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
            return <FormInputJsonItem {...f} required />
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Insert
