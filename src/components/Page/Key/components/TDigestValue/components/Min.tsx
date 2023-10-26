import { Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalQueryForm from '@/components/ModalQueryForm'

const Min: React.FC<{
  keys: APP.TDigestKey
}> = (props) => {
  return (
    <ModalQueryForm
      title="TDIGEST.MIN"
      queryWithOpen={true}
      onQuery={async () => {
        const res = await request<string>(
          'tdigest/min',
          props.keys.connection_id,
          {
            name: props.keys.name,
            db: props.keys.db
          }
        )
        return res.data
      }}
      trigger={<Button type="primary">MIN</Button>}
    ></ModalQueryForm>
  )
}
export default Min
