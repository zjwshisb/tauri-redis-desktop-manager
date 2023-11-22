import React from 'react'
import request from '@/utils/request'
import ModalQueryForm from '@/components/ModalQueryForm'
import BaseKeyForm from '../../BaseKeyForm'

const Max: React.FC<{
  keys: APP.TDigestKey
}> = (props) => {
  return (
    <ModalQueryForm
      title="TDIGEST.MAX"
      queryWithOpen={true}
      defaultValue={{
        name: props.keys.name
      }}
      onQuery={async () => {
        const res = await request<string>(
          'tdigest/max',
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
export default Max
