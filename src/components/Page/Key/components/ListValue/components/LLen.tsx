import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import BaseKeyForm from '../../BaseKeyForm'

const LLen: React.FC<{
  keys: APP.ListKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="LLEN"
      width={400}
      queryWithOpen
      defaultValue={{
        name: keys.name
      }}
      documentUrl="https://redis.io/commands/llen/"
      onQuery={async (v) => {
        const res = await request(
          'list/llen',
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
export default LLen
