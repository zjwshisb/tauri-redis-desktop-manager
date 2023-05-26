import React from 'react'
import NewConnection from '../NewConnection'
import Item from './components/Item'
import { Modal, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { Resizable } from 're-resizable'
import request from '../../utils/request'
import useStore from '../../hooks/useStore'

const Index: React.FC = () => {
  const store = useStore()

  const { t } = useTranslation()

  React.useEffect(() => {
    store.connection.fetchConnections()
  }, [store.connection])

  const handleDelete = React.useCallback(
    (conn: APP.Connection) => {
      Modal.confirm({
        title: t('notice'),
        content: '确定删除该连接?',
        async onOk() {
          await request('delete_connection', conn.id, {
            id: conn.id
          })
          store.connection.fetchConnections().then()
          message.success('操作成功')
        }
      })
    },
    [store.connection, t]
  )
  const [width, setWidth] = React.useState(200)

  return (
    <Resizable
      className={'h-screen border-r'}
      minWidth={300}
      maxWidth={500}
      onResizeStop={(e, direction, ref, d) => {
        setWidth((p) => p + d.width)
      }}
      enable={{
        right: true
      }}
      size={{
        width,
        height: '100%'
      }}
    >
      <div className="h-full overflow-y-auto bg-white pb-10" id="connection">
        <NewConnection
          onSuccess={() => {
            store.connection.fetchConnections()
          }}
        />
        <div className={''}>
          {store.connection.connections.map((v) => {
            return (
              <Item
                onDeleteClick={handleDelete}
                connection={v}
                key={v.id}
              ></Item>
            )
          })}
        </div>
      </div>
    </Resizable>
  )
}
export default observer(Index)
