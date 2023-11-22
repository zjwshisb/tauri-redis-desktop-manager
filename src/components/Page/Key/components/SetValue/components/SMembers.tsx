import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import BaseKeyForm from '../../BaseKeyForm'

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
      <BaseKeyForm></BaseKeyForm>
    </ModalQueryForm>
  )
}
export default SMembers
