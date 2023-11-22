import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const Count: React.FC<{
  keys: APP.CuckooFilterKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="CF.COUNT"
      width={500}
      documentUrl="https://redis.io/commands/cf.count/"
      onQuery={async (v) => {
        const res = await request<number>(
          'cuckoo-filter/count',
          keys.connection_id,
          {
            name: keys.name,
            db: keys.db,
            ...v
          },
          {
            showNotice: false
          }
        )
        return res.data
      }}
    >
      <BaseKeyForm>
        <FormInputJsonItem
          name="value"
          label="Item"
          tooltip="Is an item to check."
          required
        />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default Count
