import React from 'react'

import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import ValueItem from './ValueItem'

const Add: React.FC<{
  keys: APP.TDigestKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      title={'TDIGEST.ADD'}
      documentUrl="https://redis.io/commands/tdigest.add/"
      width={400}
      onSubmit={async (v) => {
        await request('tdigest/add', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then(() => {
          onSuccess()
        })
      }}
    >
      <ValueItem />
    </ModalForm>
  )
}
export default Add
