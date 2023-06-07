import React from 'react'
import { DatabaseOutlined, ReloadOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import Subscribe from './Subscribe'

import { type DBType } from './index'

const Index: React.FC<{
  active: boolean
  connection: APP.Connection
  db: DBType
}> = (props) => {
  const [keyCount, setKeyCount] = React.useState(0)

  const [loading, setLoading] = React.useState(false)

  const store = useStore()

  React.useEffect(() => {
    setLoading(true)
    request<number>('db/dbsize', props.connection?.id, {
      db: props.db.db
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
    return (
      <>
        <span className="">({keyCount})</span>
      </>
    )
  }, [keyCount, loading])

  const key = React.useMemo(() => {
    return `${props.db.db}|${props.connection.host}:${props.connection.port}`
  }, [props.connection.host, props.connection.port, props.db])

  return (
    <div
      className={classnames([
        'h-[22px] flex items-center px-2 rounded hover:cursor-pointer justify-between',
        props.active ? 'bg-blue-50' : 'hover:bg-gray-100'
      ])}
    >
      <div
        className="flex flex-1"
        onClick={() => {
          if (props.active) {
            store.db.remove(key)
          } else {
            store.db.add(props.connection, props.db.db)
          }
        }}
      >
        <DatabaseOutlined className="mr-1 text-sm" />
        <div className="w-6">{props.db.db}</div>
        <div>{child}</div>
      </div>
      <div className="flex pl-2">
        <Subscribe connection={props.connection} db={props.db.db} />
      </div>
    </div>
  )
}
export default Index
