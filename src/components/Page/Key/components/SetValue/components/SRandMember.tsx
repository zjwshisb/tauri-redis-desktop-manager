import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button } from 'antd'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputNumberItem from '@/components/Form/FormInputNumberItem'

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
      trigger={<Button type="primary">SRANDMEMBER</Button>}
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
      <FormInputItem name={'name'} label="Key" required />
      <FormInputNumberItem name={'value'} label={'Count'} />
    </ModalQueryForm>
  )
}
export default SRandMember
