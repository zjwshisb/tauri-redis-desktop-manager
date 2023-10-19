import React from 'react'
import {
  CloudServerOutlined,
  ReloadOutlined,
  KeyOutlined
} from '@ant-design/icons'
import ItemLayout from '../ItemLayout'
import request from '@/utils/request'
import useStore from '@/hooks/useStore'
import { autorun } from 'mobx'

const NodeItem: React.FC<{
  connection: APP.Connection
  node: APP.Node
  active: boolean
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

  const store = useStore()

  const child = React.useMemo(() => {
    if (loading) {
      return <ReloadOutlined spin />
    }
    return (
      <div className="flex items-center italic">
        <span>{keyCount}</span>
        <KeyOutlined />
      </div>
    )
  }, [keyCount, loading])

  return (
    <ItemLayout active={props.active}>
      <div
        className="flex flex-1 justify-between"
        onClick={() => {
          store.keyInfo.set(props.connection, 0)
        }}
      >
        <div className="flex">
          <CloudServerOutlined className="mr-1 text-sm" />
          <div>
            {props.node.host}:{props.node.port}
          </div>
        </div>
        <div>{child}</div>
      </div>
    </ItemLayout>
  )
}
export default NodeItem
