import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import BaseKeyForm from '../../BaseKeyForm'

const HKeys: React.FC<{
  keys: APP.HashKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="HKEYS"
      width={400}
      documentUrl="https://redis.io/commands/hkeys/"
      defaultValue={{
        name: keys.name
      }}
      onQuery={async (v) => {
        const res = await request(
          'hash/hkeys',
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
export default HKeys
