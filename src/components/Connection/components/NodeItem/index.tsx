import React from 'react'
import { DatabaseOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import ItemLayout from '../ItemLayout'

const NodeItem: React.FC<{
  connection: APP.Connection
  server: string
}> = (props) => {
  const store = useStore()

  return (
    <ItemLayout active={false}>
      <div
        className="flex flex-1"
        onClick={() => {
          store.db.set(props.connection, 0)
        }}
      >
        <DatabaseOutlined className="mr-1 text-sm" />
        <div className="w-6">{props.server}</div>
      </div>
    </ItemLayout>
  )
}
export default NodeItem
