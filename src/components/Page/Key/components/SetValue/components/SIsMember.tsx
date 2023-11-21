import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button } from 'antd'
import FormInputItem from '@/components/Form/FormInputItem'
import FormInputJsonItem from '@/components/Form/FormInputJsonItem'

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
      trigger={<Button type="primary">SISMEMBER</Button>}
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
      <FormInputItem name={'name'} label={'Key'} required></FormInputItem>
      <FormInputJsonItem name={'value'} label={'Item'} required />
    </ModalQueryForm>
  )
}
export default SIsMember
