import React from 'react'
import request from '@/utils/request'
import ModalQueryForm from '@/components/ModalQueryForm'
import BaseKeyForm from '../../BaseKeyForm'

const Incr: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalQueryForm
      width={400}
      defaultValue={{
        name: keys.name
      }}
      title="INCR"
      afterQueryClose={onSuccess}
      documentUrl={'https://redis.io/commands/incr/'}
      onQuery={async (v) => {
        return await request('string/incr', keys.connection_id, {
          db: keys.db,
          ...v
        }).then((r) => r.data)
      }}
    >
      <BaseKeyForm />
    </ModalQueryForm>
  )
}
export default Incr
