import React from 'react'
import request from '@/utils/request'
import ButtonAction from '@/components/ButtonAction'

const Reset: React.FC<{
  keys: APP.TDigestKey
  onSuccess: () => void
}> = (props) => {
  return (
    <ButtonAction
      type="primary"
      documentUrl="https://redis.io/commands/tdigest.reset/"
      onSubmit={async () => {
        await request<number>('tdigest/reset', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db
        })
        props.onSuccess()
      }}
    >
      RESET
    </ButtonAction>
  )
}
export default Reset
