import React from 'react'
import request from '@/utils/request'
import ModalQueryForm from '@/components/ModalQueryForm'
import BaseKeyForm from '../../BaseKeyForm'

const Min: React.FC<{
  keys: APP.TDigestKey
}> = (props) => {
  return (
    <ModalQueryForm
      title="TDIGEST.MIN"
      queryWithOpen={true}
      defaultValue={{
        name: props.keys.name
      }}
      onQuery={async () => {
        const res = await request<string>(
          'tdigest/min',
          props.keys.connection_id,
          {
            db: props.keys.db
          },
          {
            showNotice: false
          }
        )
        return res.data
      }}
    >
      <BaseKeyForm />
    </ModalQueryForm>
  )
}
export default Min
