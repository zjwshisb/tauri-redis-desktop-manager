import ModalQueryForm from '@/components/ModalQueryForm'
import React from 'react'
import request from '@/utils/request'
import { Button } from 'antd'

const SMembers: React.FC<{
  keys: APP.SetKey
}> = ({ keys }) => {
  return (
    <ModalQueryForm
      title="SMEMBERS"
      width={400}
      documentUrl="https://redis.io/commands/smembers/"
      queryWithOpen
      trigger={<Button type="primary">SMEMBERS</Button>}
      onQuery={async (v) => {
        const res = await request(
          'set/smembers',
          keys.connection_id,
          {
            name: keys.name,
            db: keys.db
          },
          {
            showNotice: false
          }
        )
        return res.data
      }}
    ></ModalQueryForm>
  )
}
export default SMembers
