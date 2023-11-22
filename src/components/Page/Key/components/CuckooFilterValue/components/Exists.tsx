import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const Exists: React.FC<{
  keys: APP.CuckooFilterKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="CF.EXISTS"
      width={500}
      documentUrl="https://redis.io/commands/cf.exists/"
      defaultValue={{
        name: keys.name
      }}
      onQuery={async (v) => {
        const res = await request<number>(
          'cuckoo-filter/exists',
          keys.connection_id,
          {
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
        ></FormInputJsonItem>
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default Exists
