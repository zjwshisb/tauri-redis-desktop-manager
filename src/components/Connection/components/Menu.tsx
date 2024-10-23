import React from 'react'
import { MenuOutlined, NodeIndexOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import CusButton from '@/components/CusButton'
import { Icon } from '@iconify/react'

interface MenuItem {
  key: string
  icon: React.ReactNode
  title: string
  mode?: 'single' | 'cluster'
}
const menuItems: MenuItem[] = [
  {
    key: 'info',
    icon: <Icon fontSize={18} icon="material-symbols:info-outline" />,
    title: 'Info'
  },
  {
    key: 'config',
    icon: <Icon icon="mynaui:config" fontSize={18} />,
    title: 'Config'
  },
  {
    key: 'node',
    icon: <NodeIndexOutlined className="hover:text-blue-600" />,
    title: 'Node',
    mode: 'cluster'
  },
  {
    key: 'client',
    icon: <Icon icon={'mdi:connection'} fontSize={18} />,
    title: 'Client'
  },
  {
    key: 'slow-log',
    icon: <Icon icon="icon-park-outline:log" fontSize={18} />,
    title: 'Slow Log'
  },
  {
    key: 'memory',
    icon: <Icon icon="material-symbols:memory" fontSize={18} />,
    title: 'Memory Analysis'
  },
  {
    key: 'pubsub',
    icon: <Icon icon={'simple-icons:googlepubsub'} />,
    title: 'Subscribe',
    mode: 'single'
  },
  {
    key: 'monitor',
    icon: <Icon icon="mdi:monitor" />,
    title: 'Monitor',
    mode: 'single'
  }
]

const Menu: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const store = useStore()

  const { t } = useTranslation()

  const connectionMenus = React.useMemo(() => {
    const menus = menuItems
      .filter((v) => {
        if (v.mode === undefined) {
          return true
        }
        if (v.mode === 'cluster' && connection.is_cluster) {
          return true
        }
        if (v.mode === 'single' && !connection.is_cluster) {
          return true
        }
        return false
      })
      .map((v) => {
        return {
          key: v.key,
          label: (
            <div className="flex items-center">
              {v.icon}
              <div className="ml-2">{t(v.title)}</div>
            </div>
          )
        }
      })
    return menus
  }, [connection, t])

  return (
    <Dropdown
      trigger={['hover']}
      className="hover:text-blue-600"
      menu={{
        onClick(e) {
          switch (e.key) {
            case 'client': {
              store.page.addPage({
                connection,
                type: 'client',
                name: 'client'
              })
              break
            }
            case 'info': {
              store.page.addPage({
                type: 'info',
                name: 'info',
                connection
              })
              break
            }
            case 'node': {
              store.page.addPage({
                type: 'node',
                name: 'node',
                connection
              })
              break
            }
            case 'slow-log': {
              store.page.addPage({
                type: 'slow-log',
                name: 'slow-log',
                connection
              })
              break
            }
            case 'config': {
              store.page.addPage({
                type: 'config',
                name: 'config',
                connection
              })
              break
            }
            case 'memory': {
              store.page.addPage({
                type: 'memory-analysis',
                name: 'mmory-analysis',

                connection
              })
              break
            }
            case 'pubsub': {
              store.page.addPage({
                type: 'pubsub',
                name: 'pubsub',

                connection
              })
              break
            }
            case 'monitor': {
              store.page.addPage({
                type: 'monitor',
                name: 'monitor',
                connection
              })
              break
            }
          }
        },
        items: connectionMenus
      }}
    >
      <CusButton icon={<MenuOutlined />}></CusButton>
    </Dropdown>
  )
}
export default observer(Menu)
