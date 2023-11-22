import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import request from '@/utils/request'
import ButtonAction from '@/components/ButtonAction'

const HDel: React.FC<{
  keys: APP.Key
  field: APP.Field
  onSuccess: (f: APP.Field) => void
}> = ({ field, keys, onSuccess }) => {
  return (
    <ButtonAction
      type="link"
      documentUrl="https://redis.io/commands/hdel/"
      showConfirm
      title="HDEL"
      onSubmit={async () => {
        await request('key/hash/hdel', keys.connection_id, {
          name: keys.name,
          fields: [field.field],
          db: keys.db
        })
        onSuccess(field)
      }}
      icon={<DeleteOutlined />}
    ></ButtonAction>
  )
}
export default HDel
