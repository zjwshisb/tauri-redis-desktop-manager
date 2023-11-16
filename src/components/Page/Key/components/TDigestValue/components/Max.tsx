import { Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import ModalQueryForm from '@/components/ModalQueryForm'

const Max: React.FC<{
  keys: APP.TDigestKey
}> = (props) => {
  return (
    <ModalQueryForm
      title="TDIGEST.MAX"
      queryWithOpen={true}
      onQuery={async () => {
        const res = await request<string>(
          'tdigest/max',
          props.keys.connection_id,
          {
            name: props.keys.name,
            db: props.keys.db
          },
          {
            showNotice: false
          }
        )
        return res.data
      }}
      trigger={<Button type="primary">MAX</Button>}
    ></ModalQueryForm>
  )
}
export default Max
