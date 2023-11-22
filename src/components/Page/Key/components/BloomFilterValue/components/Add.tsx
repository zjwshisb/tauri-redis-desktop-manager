import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const Add: React.FC<{
  keys: APP.BloomFilterKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      defaultValue={{
        value: [undefined],
        name: keys.name
      }}
      title={'BF.MADD'}
      documentUrl="https://redis.io/commands/bf.madd/"
      width={400}
      onSubmit={async (v) => {
        await request('bloom-filter/madd', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <BaseKeyForm>
        <FormListItem
          tooltip="is an item to add."
          name="value"
          label="Items"
          required
          renderItem={({ ...restField }) => {
            return <FormInputJsonItem {...restField} required />
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalForm>
  )
}
export default Add
