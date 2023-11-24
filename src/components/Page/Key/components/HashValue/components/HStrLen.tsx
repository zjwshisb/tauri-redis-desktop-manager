import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const HStrLen: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="HSTRLEN"
      width={400}
      documentUrl="https://redis.io/commands/hsetlen/"
      defaultValue={{
        name: keys.name
      }}
      onQuery={async (v) => {
        const res = await request(
          'hash/hstrlen',
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
        <FormInputJsonItem name={'value'} label={'Field'} required />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default HStrLen
