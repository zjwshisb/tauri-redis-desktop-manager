import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'
import BaseKeyForm from '../../BaseKeyForm'

const SRandMember: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SRANDMEMBER"
      width={400}
      documentUrl="https://redis.io/commands/srandmember/"
      defaultValue={{
        name: keys.name
      }}
      onQuery={async (v) => {
        const res = await request(
          'set/srandmember',
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
        <FormInputNumberItem name={'value'} label={'Count'} />
      </BaseKeyForm>
    </ModalQueryForm>
  )
}
export default SRandMember
