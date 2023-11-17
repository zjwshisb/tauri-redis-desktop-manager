import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import request from '@/utils/request'
import ButtonAction from '@/components/ButtonAction'

const SRem: React.FC<{
  keys: APP.Key
  value: string
  onSuccess: (f: string) => void
}> = ({ value, keys, onSuccess }) => {
  return (
    <ButtonAction
      documentUrl="https://redis.io/commands/srem/"
      type="link"
      icon={<DeleteOutlined />}
      onSubmit={async () => {
        await request('set/srem', keys.connection_id, {
          name: keys.name,
          value,
          db: keys.db
        })
        onSuccess(value)
      }}
    ></ButtonAction>
  )
}
export default SRem
