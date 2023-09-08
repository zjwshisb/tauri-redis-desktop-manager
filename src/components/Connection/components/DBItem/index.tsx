import React from 'react'
import { DatabaseOutlined, ReloadOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import ItemLayout from '../ItemLayout'

const Index: React.FC<{
  active: boolean
  connection: APP.Connection
  item: APP.Database
}> = (props) => {
  const { connection, item } = props

  const [keyCount, setKeyCount] = React.useState(0)

  const [loading, setLoading] = React.useState(false)

  const store = useStore()

  React.useEffect(() => {
    setLoading(true)
    request<number>('db/dbsize', connection.id, {
      db: item.database
    })
      .then((res) => {
        setKeyCount(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [connection.id, item])

  const child = React.useMemo(() => {
    if (loading) {
      return <ReloadOutlined spin />
    }
    return <span className="">({keyCount})</span>
  }, [keyCount, loading])

  return (
    <ItemLayout active={props.active} clickAble={true}>
      <div
        className="flex flex-1"
        onClick={() => {
          store.keyInfo.set(props.connection, item.database)
        }}
      >
        <DatabaseOutlined className="mr-1 text-sm" />
        <div className="w-8">{item.database}</div>
        <div>{child}</div>
      </div>
    </ItemLayout>
  )
}
export default Index
