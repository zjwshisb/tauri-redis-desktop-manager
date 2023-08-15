import React from 'react'
import { HomeOutlined, ControlOutlined, MenuOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import Monitor from './Monitor'
import { getPageKey } from '@/utils'
import Client from '@/components/Page/Client'
import Info from '@/components/Page/Info'
import Subscribe from './Subscribe'

const Menu: React.FC<{
  connection: APP.Connection
  db?: number[]
}> = ({ connection, db }) => {
  const store = useStore()

  const { t } = useTranslation()

  const connectionMenus = React.useMemo(() => {
    let menus = [
      {
        key: 'info',
        label: (
          <div className="flex">
            <HomeOutlined className="hover:text-blue-600" />
            <div className="ml-2">{t('Info')}</div>
          </div>
        )
      },
      {
        key: 'client',
        label: (
          <div className="flex">
            <ControlOutlined className="hover:text-blue-600" />
            <div className="ml-2">{t('Client')}</div>
          </div>
        )
      }
    ]
    if (!connection.is_cluster) {
      menus = menus.concat([
        {
          key: 'monitor',
          label: <Monitor connection={connection} />
        },
        {
          key: 'Subscribe',
          label: <Subscribe connection={connection}></Subscribe>
        }
      ])
    }
    return menus
  }, [connection, t])

  return (
    <Dropdown
      trigger={['hover']}
      className="hover:text-blue-600"
      menu={{
        onClick(e) {
          e.domEvent.stopPropagation()
          switch (e.key) {
            case 'client': {
              const key = getPageKey('client', connection)
              store.page.addPage({
                label: key,
                connection,
                type: 'client',
                key,
                children: <Client connection={connection}></Client>
              })
              break
            }
            case 'info': {
              const key = getPageKey('info', connection)
              store.page.addPage({
                label: key,
                type: 'info',
                key,
                children: <Info connection={connection}></Info>,
                connection
              })
              break
            }
          }
        },
        items: connectionMenus
      }}
    >
      <MenuOutlined
        onClick={(e) => {
          e.stopPropagation()
        }}
      />
    </Dropdown>
  )
}
export default observer(Menu)
