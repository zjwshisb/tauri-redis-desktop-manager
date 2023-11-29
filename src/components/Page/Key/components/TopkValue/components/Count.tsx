import React from 'react'

import request from '@/utils/request'

import FormInputItem from '@/components/Form/FormInputItem'
import BaseKeyForm from '../../BaseKeyForm'
import FormListItem from '@/components/Form/FormListItem'
import ModalQueryForm from '@/components/ModalQueryForm'

const Count: React.FC<{
  keys: APP.TopKKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      width={400}
      documentUrl="https://redis.io/commands/topk.count/"
      defaultValue={{
        name: keys.name,
        value: [undefined]
      }}
      onQuery={async (v) => {
        const res = await request(
          'topk/count',
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
      title="TOPK.COUNT"
    >
      <BaseKeyForm>
        <FormListItem
          name={'value'}
          required
          renderItem={(f) => {
            return <FormInputItem {...f} required />
          }}
        ></FormListItem>
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default Count
