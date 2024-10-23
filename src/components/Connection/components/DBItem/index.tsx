import React from 'react'
import { DatabaseOutlined, KeyOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import ItemLayout from '../ItemLayout'
import { Dropdown, App } from 'antd'
import { ItemType } from 'antd/es/menu/interface'
import { t } from 'i18next'
import { observer } from 'mobx-react-lite'

const DBItem: React.FC<{
  active: boolean
  connection: APP.Connection
  item: APP.Database
}> = (props) => {
  const { connection, item } = props

  const store = useStore()

  const { modal, message } = App.useApp()

  const child = React.useMemo(() => {
    return (
      <div className="flex items-center  italic">
        <span>{item.count}</span>
        <KeyOutlined className="text-sm" />
      </div>
    )
  }, [item.count])

  const menuItems = React.useMemo(() => {
    const m: ItemType[] = []
    if (!connection.readonly) {
      m.push({
        label: t('Flush Database'),
        key: 'flush'
      })
    }
    m.push({
      label: t('Open In New Window'),
      key: 'window'
    })
    return m
  }, [connection.readonly])

  const children = (
    <div
      data-active={props.active}
      className="flex flex-1 justify-between"
      onClick={() => {
        store.keyInfo.set(props.connection, item.database)
      }}
    >
      <div className="flex">
        <DatabaseOutlined className="mr-1 text-sm" />
        <div>{item.database}</div>
      </div>
      <div>{child}</div>
    </div>
  )
  if (menuItems.length <= 0) {
    return <ItemLayout active={props.active}>{children}</ItemLayout>
  }

  return (
    <ItemLayout active={props.active}>
      <Dropdown
        trigger={['contextMenu']}
        menu={{
          onClick(e) {
            switch (e.key) {
              case 'flush': {
                modal.confirm({
                  title: t('Notice'),
                  content: t('Are you sure flush this database?'),
                  async onOk() {
                    await request('db/flush', connection.id, {
                      db: item.database
                    })
                    store.connection.getInfo(connection)
                    message.success(t('Success'))
                  }
                })
                break
              }
              case 'window': {
                store.keyInfo.newWindow(connection, item.database)
              }
            }
          },
          items: menuItems
        }}
      >
        {children}
      </Dropdown>
    </ItemLayout>
  )
}
export default observer(DBItem)
