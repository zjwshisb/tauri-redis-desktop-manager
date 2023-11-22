import React from 'react'
import request from '@/utils/request'
import ModalQueryForm from '@/components/ModalQueryForm'
import BaseKeyForm from '../../BaseKeyForm'

const Decr: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalQueryForm
      width={400}
      defaultValue={{
        name: keys.name
      }}
      title="DECR"
      afterQueryClose={onSuccess}
      documentUrl={'https://redis.io/commands/decr/'}
      onQuery={async (v) => {
        return await request('string/decr', keys.connection_id, {
          db: keys.db,
          ...v
        }).then((r) => r.data)
      }}
    >
      <BaseKeyForm />
    </ModalQueryForm>
  )
}
export default Decr
