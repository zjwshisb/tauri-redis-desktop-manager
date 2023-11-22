import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const RPop: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalQueryForm
      title="RPOP"
      width={400}
      afterQueryClose={onSuccess}
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/rpop/"
      onQuery={async (v) => {
        const res = await request(
          'list/rpop',
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
        <FormInputNumberItem label={'Count'} name={'value'} />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default RPop
