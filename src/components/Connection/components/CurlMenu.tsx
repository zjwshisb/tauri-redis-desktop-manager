import React from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Dropdown, App } from 'antd'
import { useTranslation } from 'react-i18next'
import CusButton from '@/components/CusButton'
import { Icon } from '@iconify/react'

export interface DBType {
  db: number
  count: number
}

const Index: React.FC<{
  connection: APP.Connection
  onOpen: (c: APP.Connection) => void
}> = ({ connection, onOpen }) => {
  const store = useStore()

  const { message, modal } = App.useApp()

  const { t } = useTranslation()

  const connectionMenus = React.useMemo(() => {
    const menus = [
      {
        key: 'edit',
        label: (
          <div className="flex">
            <EditOutlined />
            <div className="ml-2">{t('Edit Connection')}</div>
          </div>
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
    if (connection.open === true) {
      menus.unshift({
        key: 'close',
        label: (
          <div className="flex items-center">
            <Icon icon={'clarity:disconnect-line'} />
            <div className="ml-2">{t('Close Connection')}</div>
          </div>
        )
      })
    } else {
      menus.unshift({
        key: 'open',
        label: (
          <div className="flex items-center">
            <Icon icon={'hugeicons:connect'} />
            <div className="ml-2">{t('Open Connection')}</div>
          </div>
        )
      })
    }
    return menus
  }, [t, connection.open])

  return (
    <>
      <Dropdown
        trigger={['hover']}
        className="hover:text-blue-600"
        menu={{
          onClick(e) {
            e.domEvent.stopPropagation()
            switch (e.key) {
              case 'delete': {
                modal.confirm({
                  title: t('Notice'),
                  content: t('Are you sure delete <{{name}}>?', {
                    name: t('Connection')
                  }),
                  async onOk() {
                    store.connection.remove(connection.id)
                    message.success(t('Success'))
                  }
                })
                break
              }
              case 'edit': {
                if (connection.open === true) {
                  modal.confirm({
                    title: t('Notice'),
                    content: t('You must close the connection before editing'),
                    onOk: () => {
                      store.connection.close(connection.id)
                      store.connection.openForm(connection)
                    }
                  })
                } else {
                  store.connection.openForm(connection)
                }
                break
              }
              case 'open': {
                store.connection.open(connection.id).then(() => {
                  onOpen(connection)
                })
                break
              }
              case 'close': {
                store.connection.close(connection.id)
                break
              }
            }
          },
          items: connectionMenus
        }}
      >
        <CusButton
          icon={<Icon icon={'material-symbols:edit-outline'}></Icon>}
        ></CusButton>
      </Dropdown>
    </>
  )
}
export default observer(Index)
