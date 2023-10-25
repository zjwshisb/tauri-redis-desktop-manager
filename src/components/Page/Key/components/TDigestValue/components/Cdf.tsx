import React from 'react'

import { Button } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import ValueItem from './ValueItem'

const Cdf: React.FC<{
  keys: APP.TDigestKey
  onSuccess: (f: Array<APP.Field<string>>) => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      title={'TDIGEST.CDF'}
      documentUrl="https://redis.io/commands/tdigest.revrank/"
      width={400}
      trigger={<Button type="primary">CDF</Button>}
      onSubmit={async (v) => {
        await request<string[]>('tdigest/cdf', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then((r) => {
          const f: Array<APP.Field<string>> = []
          for (let i = 0; i < r.data.length; i++) {
            f.push({
              field: v.value[i],
              value: r.data[i]
            })
          }
          onSuccess(f)
        })
      }}
    >
      <ValueItem />
    </ModalForm>
  )
}
export default Cdf
