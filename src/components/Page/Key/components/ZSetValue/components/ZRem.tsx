import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Modal, message } from 'antd'
import request from '@/utils/request'
import IconButton from '@/components/IconButton'

const Index: React.FC<{
  keys: APP.Key
  value: string
  onSuccess: (f: string) => void
}> = ({ value, keys, onSuccess }) => {
  return (
    <IconButton
      icon={<DeleteOutlined />}
      onClick={() => {
        Modal.confirm({
          title: 'notice',
          content: `confirm delete <${value}>?`,
          async onOk() {
            await request('key/zset/zrem', keys.connection_id, {
              name: keys.name,
              value,
              db: keys.db
            })
            message.success('success')
            onSuccess(value)
          }
        })
      }}
    ></IconButton>
  )
}
export default Index
