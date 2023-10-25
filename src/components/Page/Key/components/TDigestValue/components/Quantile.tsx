import React from 'react'

import { Button } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import ValueItem from './ValueItem'

const Quantile: React.FC<{
  keys: APP.TDigestKey
  onSuccess: (f: Array<APP.Field<string>>) => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      title={'TDIGEST.QUANTILE'}
      documentUrl="https://redis.io/commands/tdigest.quantile/"
      width={400}
      trigger={<Button type="primary">QUANTILE</Button>}
      onSubmit={async (v) => {
        await request<string[]>('tdigest/quantile', keys.connection_id, {
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
      <ValueItem label="Quantile" />
    </ModalForm>
  )
}
export default Quantile
