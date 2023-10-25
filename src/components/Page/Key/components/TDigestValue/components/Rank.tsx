import React from 'react'

import { Button } from 'antd'
import ModalForm from '@/components/ModalForm'
import request from '@/utils/request'
import ValueItem from './ValueItem'

const Rank: React.FC<{
  keys: APP.TDigestKey
  onSuccess: (f: Array<APP.Field<number>>) => void
}> = ({ keys, onSuccess }) => {
  return (
    <ModalForm
      defaultValue={{
        value: [undefined]
      }}
      title={'TDIGEST.RANK'}
      documentUrl="https://redis.io/commands/tdigest.rank/"
      width={400}
      trigger={<Button type="primary">RANK</Button>}
      onSubmit={async (v) => {
        await request<number[]>('tdigest/rank', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          ...v
        }).then((r) => {
          const f: Array<APP.Field<number>> = []
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
export default Rank
