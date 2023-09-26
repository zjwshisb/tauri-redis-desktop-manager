import React from 'react'
import {
  DatabaseOutlined,
  ReloadOutlined,
  KeyOutlined
} from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import request from '@/utils/request'
import ItemLayout from '../ItemLayout'
import { Dropdown, Modal, message } from 'antd'
import { t } from 'i18next'
import { type ItemType } from 'antd/es/menu/hooks/useItems'

const Index: React.FC<{
  active: boolean
  connection: APP.Connection
  item: APP.Database
}> = (props) => {
  const { connection, item } = props

  const [keyCount, setKeyCount] = React.useState(0)

  const [loading, setLoading] = React.useState(false)

  const store = useStore()

  const getCount = React.useCallback(() => {
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
  }, [connection.id, item.database])

  React.useEffect(() => {
    getCount()
  }, [getCount])

  const child = React.useMemo(() => {
    if (loading) {
      return <ReloadOutlined spin />
    }
    return (
      <div className="flex items-center text-slate-600 italic">
        <span>{keyCount}</span>
        <KeyOutlined className="text-sm" />
      </div>
    )
  }, [keyCount, loading])

  const menuItems = React.useMemo(() => {
    const m: ItemType[] = []
    if (!connection.readonly) {
      m.push({
        label: 'flush',
        key: 'flush'
      })
    }
    return m
  }, [connection.readonly])

  const children = (
    <div
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
                Modal.confirm({
                  title: t('Notice'),
                  content: t('Are you sure flush this database?'),
                  async onOk() {
                    await request('db/flush', connection.id, {
                      db: item.database
                    })
                    getCount()
                    message.success(t('Success'))
                  }
                })
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
export default Index
