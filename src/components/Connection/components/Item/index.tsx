import React from 'react'
import {
  DeleteOutlined,
  SettingOutlined,
  RightOutlined,
  DownOutlined,
  DisconnectOutlined,
  MenuFoldOutlined,
  ControlOutlined,
  EditOutlined,
  PoweroffOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import Info from '@/components/Page/Info'
import Client from '@/components/Page/Client'
import { useThrottleFn } from 'ahooks'
import { Space, Dropdown, Typography } from 'antd'
import DBItem from './DBItem'

export interface DBType {
  db: number
  count: number
}

const Index: React.FC<{
  connection: APP.Connection
  onDeleteClick: (conn: APP.Connection) => void
  onConnectionChange?: (conn: APP.Connection) => void
}> = ({ connection, onDeleteClick }) => {
  const store = useStore()

  const [collapse, setCollapse] = React.useState(false)
  const [databases, setDatabases] = React.useState<DBType[]>([])

  const isOpen = React.useMemo(() => {
    return store.connection.openIds[connection.id]
  }, [connection.id, store.connection.openIds])

  const icon = React.useMemo(() => {
    if (isOpen) {
      if (collapse) {
        return <DownOutlined className="text-sm mr-1" />
      } else {
        return <RightOutlined className="text-sm mr-1" />
      }
    } else {
      return <DisconnectOutlined className="text-sm mr-1" />
    }
  }, [collapse, isOpen])

  const getDbs = React.useCallback(async () => {
    await request<string>('config/databases', connection.id).then((res) => {
      const dbs: DBType[] = []
      for (let i = 0; i < parseInt(res.data); i++) {
        dbs.push({
          db: i,
          count: 0
        })
      }
      setDatabases(dbs)
    })
  }, [connection.id])

  const onItemClick = React.useCallback(() => {
    if (isOpen) {
      setCollapse((p) => !p)
    } else {
      getDbs().then(() => {
        setCollapse(true)
        store.connection.open(connection.id)
      })
    }
  }, [connection.id, getDbs, isOpen, store.connection])

  const onItemClickTh = useThrottleFn(onItemClick, {
    wait: 500
  })

  const height = React.useMemo(() => {
    if (isOpen && collapse) {
      return (22 * databases.length).toString() + 'px'
    } else {
      return 0
    }
  }, [collapse, databases, isOpen])

  const connectionMenus = React.useMemo(() => {
    const menus = [
      {
        key: 'edit',
        label: (
          <div
            className="flex"
            onClick={(e) => {
              e.stopPropagation()
              console.log('hahaha')
              store.connection.close(connection.id)
            }}
          >
            <EditOutlined />
            <div className="ml-2">Edit Connection</div>
          </div>
        )
      },
      {
        key: 'delete',
        label: (
          <div
            className="flex"
            onClick={(e) => {
              e.stopPropagation()
              console.log(e)
            }}
          >
            <DeleteOutlined />
            <div className="ml-2">Delete Connection</div>
          </div>
        )
      }
    ]
    if (isOpen) {
      menus.unshift({
        key: 'close',
        label: (
          <div
            className="flex"
            onClick={(e) => {
              e.stopPropagation()
              store.connection.close(connection.id)
            }}
          >
            <PoweroffOutlined />
            <div className="ml-2">Close Connection</div>
          </div>
        )
      })
    }
    return menus
  }, [connection.id, isOpen, store.connection])

  return (
    <div className={'my-2 px-2 box-border'}>
      <div
        className={
          'flex justify-between rounded hover:bg-gray-100 hover:cursor-pointer text-lg'
        }
        onClick={onItemClickTh.run}
      >
        <div className={'flex overflow-hidden'}>
          {icon}
          <div className="truncate">
            {connection.host}:{connection.port}
          </div>
        </div>
        <div className={'flex-shrink-0 pl-2'}>
          <Space>
            <ReloadOutlined
              className="hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation()
                getDbs()
              }}
            ></ReloadOutlined>
            <SettingOutlined
              className="hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation()
                store.page.addPage({
                  label: `info|${connection.host}:${connection.port}`,
                  key: `info|${connection.host}:${connection.port}`,
                  children: <Info connection={connection}></Info>
                })
              }}
            />
            <ControlOutlined
              className="hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation()
                store.page.addPage({
                  label: `client|${connection.host}:${connection.port}`,
                  key: `client|${connection.host}:${connection.port}`,
                  children: <Client connection={connection}></Client>
                })
              }}
            ></ControlOutlined>
            <Dropdown
              className="hover:text-blue-600"
              menu={{
                onClick(e) {
                  e.domEvent.stopPropagation()
                  switch (e.key) {
                    case 'client': {
                      store.page.addPage({
                        label: `client|${connection.host}:${connection.port}`,
                        key: `client|${connection.host}:${connection.port}`,
                        children: <Client connection={connection}></Client>
                      })
                      break
                    }
                    case 'info': {
                      store.page.addPage({
                        label: `info|${connection.host}:${connection.port}`,
                        key: `info|${connection.host}:${connection.port}`,
                        children: <Info connection={connection}></Info>
                      })
                      break
                    }
                  }
                },
                items: connectionMenus
              }}
            >
              <MenuFoldOutlined />
            </Dropdown>
          </Space>
        </div>
      </div>
      <div
        className={classnames(['overflow-hidden transition-all'])}
        style={{
          height
        }}
      >
        {databases.map((item, index) => {
          const active = store.db.db.findIndex((v) => {
            return v.connection.id === connection.id && v.db === item.db
          })
          return (
            <DBItem
              db={item}
              connection={connection}
              active={active > -1}
              key={index}
            ></DBItem>
          )
        })}
      </div>
    </div>
  )
}
export default observer(Index)
