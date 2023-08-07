import React from 'react'
import { DatabaseOutlined, ReloadOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import ItemLayout from '../ItemLayout'

const Index: React.FC<{
  active: boolean
  connection: APP.Connection
  db: number
}> = (props) => {
  const [keyCount, setKeyCount] = React.useState(0)

  const [loading, setLoading] = React.useState(false)

  const store = useStore()

  React.useEffect(() => {
    setLoading(true)
    request<number>('db/dbsize', props.connection?.id, {
      db: props.db
    })
      .then((res) => {
        setKeyCount(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [props.connection.id, props.db])

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
          store.keyInfo.set(props.connection, props.db)
        }}
      >
        <DatabaseOutlined className="mr-1 text-sm" />
        <div className="w-6">{props.db}</div>
        <div>{child}</div>
      </div>
    </ItemLayout>
  )
}
export default Index
