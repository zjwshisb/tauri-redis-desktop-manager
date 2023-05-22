import React from 'react'
import NewConnection from '../NewConnection'
import Item from './components/Item'
import { Modal, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import request from '../../utils/request'
import useStore from '../../hooks/useStore'

const Index: React.FC = () => {
  const store = useStore()

  const { t } = useTranslation()

  React.useEffect(() => {
    store.connection.fetchConnections()
  }, [store.connection])

  const handleDelete = React.useCallback((conn: APP.Connection) => {
    Modal.confirm({
      title: t('notice'),
      content: '确定删除该连接?',
      async onOk () {
        await request('delete_connection', conn.id, {
          id: conn.id
        })
        store.connection.fetchConnections().then()
        message.success('操作成功')
      }
    })
  }, [store.connection, t])

  return (
      <div className="border-r h-full overflow-y-auto" id="connection">
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
  )
}
export default observer(Index)
