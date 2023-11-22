import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'

import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const Exists: React.FC<{
  keys: APP.BloomFilterKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="BF.EXISTS"
      width={500}
      documentUrl="https://redis.io/commands/bf.exists/"
      defaultValue={{
        name: keys.name
      }}
      onQuery={async (v) => {
        const res = await request<number>(
          'bloom-filter/exists',
          keys.connection_id,
          {
            name: keys.name,
            db: keys.db,
            ...v
          }
        )
        return res.data
      }}
    >
      <BaseKeyForm>
        <FormInputJsonItem
          name="value"
          label="Item"
          tooltip="is an item to check."
        />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default Exists
