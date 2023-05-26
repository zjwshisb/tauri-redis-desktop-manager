import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Modal, message } from 'antd'
import request from '@/utils/request'
import { actionIconStyle } from '@/utils/styles'

const Index: React.FC<{
  keys: APP.Key
  value: string
  onSuccess: (f: string) => void
}> = ({ value, keys, onSuccess }) => {
  return (
    <DeleteOutlined
      className="hover:cursor-pointer"
      style={actionIconStyle}
      key={'delete'}
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
    />
  )
}
export default Index
