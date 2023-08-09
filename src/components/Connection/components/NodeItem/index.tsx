import React from 'react'
import { CloudServerOutlined, ReloadOutlined } from '@ant-design/icons'
import ItemLayout from '../ItemLayout'
import request from '@/utils/request'

const NodeItem: React.FC<{
  connection: APP.Connection
  node: string
  active: boolean
}> = (props) => {
  const [keyCount, setKeyCount] = React.useState(0)

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    request<number>('cluster/nodesize', props.connection.id, {
      node: props.node
    })
      .then((res) => {
        setKeyCount(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [props.connection.id, props.node])

  const child = React.useMemo(() => {
    if (loading) {
      return <ReloadOutlined spin />
    }
    return <span className="">({keyCount})</span>
  }, [keyCount, loading])

  return (
    <ItemLayout active={props.active} clickAble={false}>
      <div className="flex flex-1">
        <CloudServerOutlined className="mr-1 text-sm" />
        <div>{props.node}</div>
        <div className="ml-2">{child}</div>
      </div>
    </ItemLayout>
  )
}
export default NodeItem
