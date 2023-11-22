import Editable from '@/components/Editable'

import React from 'react'
import request from '@/utils/request'
import ButtonAction from '@/components/ButtonAction'

const ResetStat: React.FC<{
  connection: APP.Connection
  onSuccess: () => void
}> = ({ connection, onSuccess }) => {
  return (
    <Editable connection={connection}>
      <ButtonAction
        title="RESETSTAT"
        documentUrl="https://redis.io/commands/config-resetstat/"
        showConfirm
        onSubmit={async () => {
          await request('config/resetstat', connection.id)
          onSuccess()
        }}
      >
        RESETSTAT
      </ButtonAction>
    </Editable>
  )
}
export default ResetStat
