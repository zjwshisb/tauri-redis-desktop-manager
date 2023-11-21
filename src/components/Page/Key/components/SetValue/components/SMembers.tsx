import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button } from 'antd'
import FormInputItem from '@/components/Form/FormInputItem'

const SMembers: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SMEMBERS"
      width={400}
      documentUrl="https://redis.io/commands/smembers/"
      defaultValue={{
        name: keys.name
      }}
      queryWithOpen
      trigger={<Button type="primary">SMEMBERS</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/smembers',
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
      <FormInputItem name={'name'} label="Key" />
    </ModalQueryForm>
  )
}
export default SMembers
