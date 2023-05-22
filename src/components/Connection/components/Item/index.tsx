import React from 'react'
import {
  DeleteOutlined,
  SettingOutlined,
  RightOutlined,
  DatabaseOutlined,
  DownOutlined,
  DisconnectOutlined
} from '@ant-design/icons'
import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import Info from '@/components/Page/Info'

const Index: React.FC<{
  connection: APP.Connection
  onDeleteClick: (conn: APP.Connection) => void
  onConnectionChange?: (conn: APP.Connection) => void
}> = ({ connection, onDeleteClick }) => {
  const store = useStore()

  const [collapse, setCollapse] = React.useState(false)
  const [databaseSize, setDatabaseSize] = React.useState(0)

  const isOpen = React.useMemo(() => {
    return store.connection.openIds[connection.id] === true
  }, [connection.id, store.connection.openIds])

  const icon = React.useMemo(() => {
    if (isOpen) {
      if (collapse) {
        return <DownOutlined className='text-sm mr-1' />
      } else {
        return <RightOutlined className='text-sm mr-1'/>
      }
    } else {
      return <DisconnectOutlined className='text-sm mr-1'/>
    }
  }, [collapse, isOpen])

  const db = React.useMemo(() => {
    return new Array(databaseSize).fill(1)
  }, [databaseSize])

  const onItemClick = React.useCallback(() => {
    if (isOpen) {
      setCollapse(p => !p)
    } else {
      request<string>('config/databases', connection.id).then(res => {
        setDatabaseSize(parseInt(res.data))
        setCollapse(true)
        store.connection.open(connection.id)
      })
    }
  }, [connection.id, isOpen, store.connection])

  const height = React.useMemo(() => {
    if (isOpen && collapse) {
      return (22 * (databaseSize + 1)).toString() + 'px'
    } else {
      return 0
    }
  }, [collapse, databaseSize, isOpen])

  return <div className={'my-1 px-2 box-border'}>
          <div className={'flex justify-between rounded hover:bg-gray-100 hover:cursor-pointer'} onClick={onItemClick}>
              <div className={'flex'}>
                  {icon}
                  <div>
                    {connection.host}:{connection.port}
                  </div>
              </div>
              <div className={''}>
                  <DeleteOutlined className={''} onClick={(e) => {
                    e.stopPropagation()
                    onDeleteClick(connection)
                  }}
                  />
              </div>
          </div>
          <div className={classnames(['overflow-hidden transition-all'])} style={{
            height
          }}>
              <div className={'h-[22px] flex items-center px-2 rounded hover:cursor-pointer hover:bg-gray-100'} onClick={() => {
                store.page.addPage({
                  label: 'info',
                  key: '1',
                  children: <Info connection={connection}></Info>
                })
              }}>
                  <SettingOutlined className={'mr-1 text-sm'}></SettingOutlined>
                  <div>info</div>
              </div>
              {
                  db.map((v, index) => {
                    const key = connection.host + index.toString()
                    const active = store.db.db.findIndex(v => {
                      return v.connection.id === connection.id && v.db === index
                    })
                    return <div
                      key ={key}
                      onClick={() => {
                        if (active > -1) {
                          store.db.remove(key)
                        } else {
                          store.db.add(connection, index)
                        }
                      }}
                      className={classnames(['h-[22px] flex items-center px-2 rounded hover:cursor-pointer', active > -1 ? 'bg-sky-200' : ' hover:bg-gray-100'])} >
                      <DatabaseOutlined className={'mr-1 text-sm'}></DatabaseOutlined>
                      <div>{index}</div>
                  </div>
                  })
              }
          </div>
    </div>
}
export default observer(Index)
