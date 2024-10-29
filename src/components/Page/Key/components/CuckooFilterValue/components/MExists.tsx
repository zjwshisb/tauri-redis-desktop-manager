import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormListItem from '@/components/Form/FormListItem'

import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const MExists: React.FC<{
  keys: APP.CuckooFilterKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="CF.MEXISTS"
      defaultValue={{
        value: [undefined],
        name: keys.name
      }}
      width={500}
      documentUrl="https://redis.io/commands/cf.mexists/"
      onQuery={async (v) => {
        const res = await request<number>(
          'cuckoo-filter/mexists',
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
        <FormListItem
          tooltip="Is an item to check."
          label="Item"
          required
          name="value"
          renderItem={({ name, ...restField }) => {
            return (
              <FormInputJsonItem {...restField} name={[name]} required={true} />
            )
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default MExists
