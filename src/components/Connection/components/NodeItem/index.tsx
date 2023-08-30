import React from 'react'
import { CloudServerOutlined, ReloadOutlined } from '@ant-design/icons'
import ItemLayout from '../ItemLayout'
import request from '@/utils/request'
import { autorun } from 'mobx'

const NodeItem: React.FC<{
  connection: APP.Connection
  node: APP.Node
}> = (props) => {
  const [keyCount, setKeyCount] = React.useState(0)

  const [loading, setLoading] = React.useState(false)

  autorun(() => {
    request<number>('cluster/nodesize', props.connection.id, {
      id: props.node.id
    })
      .then((res) => {
        setKeyCount(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  })

  const child = React.useMemo(() => {
    if (loading) {
      return <ReloadOutlined spin />
    }
    return <span className="">({keyCount})</span>
  }, [keyCount, loading])

  return (
    <ItemLayout active={false} clickAble={false}>
      <div className="flex flex-1">
        <CloudServerOutlined className="mr-1 text-sm" />
        <div>
          {props.node.host}:{props.node.port}
        </div>
        <div className="ml-2">{child}</div>
      </div>
    </ItemLayout>
  )
}
export default NodeItem
