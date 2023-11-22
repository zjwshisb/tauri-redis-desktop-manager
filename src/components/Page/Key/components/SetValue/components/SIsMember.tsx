import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'
import BaseKeyForm from '../../BaseKeyForm'

const SIsMember: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SISMEMBER"
      width={400}
      documentUrl="https://redis.io/commands/sismember/"
      defaultValue={{
        name: keys.name
      }}
      onQuery={async (v) => {
        const res = await request(
          'set/sismember',
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
        <FormInputJsonItem name={'value'} label={'Item'} required />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default SIsMember
