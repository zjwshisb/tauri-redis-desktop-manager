import React from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  PoweroffOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import { Dropdown, Modal, message } from 'antd'
import { useTranslation } from 'react-i18next'
import ConnectionForm from '@/components/ConnectionForm'

export interface DBType {
  db: number
  count: number
}

const Index: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const store = useStore()

  const { t } = useTranslation()

  const isOpen = React.useMemo(() => {
    return store.connection.openIds[connection.id]
  }, [connection.id, store.connection.openIds])

  const connectionMenus = React.useMemo(() => {
    const menus = [
      {
        key: 'edit',
        label: (
          <ConnectionForm
            onSuccess={store.connection.fetchConnections}
            connection={connection}
            trigger={
              <div
                className="flex"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <EditOutlined />
                <div className="ml-2">{t('Edit Connection')}</div>
              </div>
            }
          ></ConnectionForm>
        )
      },
      {
        key: 'delete',
        label: (
          <div className="flex">
            <DeleteOutlined />
            <div className="ml-2">{t('Delete Connection')}</div>
          </div>
        )
      }
    ]
    if (isOpen) {
      menus.unshift({
        key: 'close',
        label: (
          <div className="flex">
            <PoweroffOutlined />
            <div className="ml-2">{t('Close Connection')}</div>
          </div>
        )
      })
    }
    return menus
  }, [store, connection, t, isOpen])

  return (
    <Dropdown
      trigger={['hover']}
      className="hover:text-blue-600"
      menu={{
        onClick(e) {
          e.domEvent.stopPropagation()
          switch (e.key) {
            case 'delete': {
              Modal.confirm({
                title: t('Notice'),
                content: t('Are you sure delete <{{name}}>?', {
                  name: t('Connection')
                }),
                async onOk() {
                  await request('connections/del', 0, {
                    id: connection.id
                  })
                  store.removeConnection(connection.id)
                  message.success(t('Success'))
                }
              })
              break
            }
            case 'close': {
              store.closeConnection(connection.id)
              break
            }
          }
        },
        items: connectionMenus
      }}
    >
      <AppstoreOutlined
        onClick={(e) => {
          e.stopPropagation()
        }}
      />
    </Dropdown>
  )
}
export default observer(Index)
