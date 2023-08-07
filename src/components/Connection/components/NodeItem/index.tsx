import React from 'react'
import { CloudServerOutlined } from '@ant-design/icons'
import ItemLayout from '../ItemLayout'

const NodeItem: React.FC<{
  connection: APP.Connection
  server: string
  active: boolean
}> = (props) => {
  return (
    <ItemLayout active={props.active} clickAble={false}>
      <div className="flex flex-1">
        <CloudServerOutlined className="mr-1 text-sm" />
        <div className="w-6">{props.server}</div>
      </div>
    </ItemLayout>
  )
}
export default NodeItem
