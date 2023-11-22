import React from 'react'
import request from '@/utils/request'
import ButtonAction from '@/components/ButtonAction'
import Editable from '@/components/Editable'

const Rewrite: React.FC<{
  connection: APP.Connection
  onSuccess: () => void
}> = ({ connection, onSuccess }) => {
  return (
    <Editable connection={connection}>
      <ButtonAction
        showConfirm={true}
        title="REWRITE"
        documentUrl="https://redis.io/commands/config-rewrite/"
        onSubmit={async () => {
          await request('config/rewrite', connection.id)
          onSuccess()
        }}
      >
        REWRITE
      </ButtonAction>
    </Editable>
  )
}
export default Rewrite
