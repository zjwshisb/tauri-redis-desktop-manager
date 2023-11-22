import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const LIndex: React.FC<{
  keys: APP.ListKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      width={400}
      documentUrl="https://redis.io/commands/lindex/"
      defaultValue={{
        name: keys.name
      }}
      onQuery={async (v) => {
        const res = await request(
          'list/lindex',
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
        <FormInputNumberItem name={'value'} label={'Index'} required />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default LIndex
