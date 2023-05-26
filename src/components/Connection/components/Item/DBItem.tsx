import React from 'react'
import { DatabaseOutlined, KeyOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import { Statistic } from 'antd'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import { type DBType } from './index'

const Index: React.FC<{
  active: boolean
  connection: APP.Connection
  db: DBType
}> = (props) => {
  const [keyCount, setKeyCount] = React.useState(0)

  const store = useStore()

  React.useEffect(() => {
    request<number>('db/dbsize', props.connection?.id, {
      db: props.db.db
    }).then((res) => {
      setKeyCount(res.data)
    })
  }, [props.connection.id, props.db])

  const key = React.useMemo(() => {
    return `${props.db.db}|${props.connection.host}:${props.connection.port}`
  }, [props.connection.host, props.connection.port, props.db])

  return (
    <div
      className={classnames([
        'h-[22px] flex items-center px-2 rounded hover:cursor-pointer justify-between',
        props.active ? 'bg-blue-50' : 'hover:bg-gray-100'
      ])}
      onClick={() => {
        if (props.active) {
          store.db.remove(key)
        } else {
          store.db.add(props.connection, props.db.db)
        }
      }}
    >
      <div className="flex">
        <DatabaseOutlined className="mr-1 text-sm" />
        <div>{props.db.db}</div>
      </div>
      <div className="flex">
        <Statistic
          value={keyCount}
          valueStyle={{ fontSize: '12px' }}
        ></Statistic>
        <KeyOutlined className="text-xs" />
      </div>
    </div>
  )
}
export default Index
