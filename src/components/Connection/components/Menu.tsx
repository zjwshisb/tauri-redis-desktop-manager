import React from 'react'
import {
  HomeOutlined,
  ControlOutlined,
  MenuOutlined,
  NodeIndexOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  CalculatorOutlined,
  BookOutlined,
  MonitorOutlined
} from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Button, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'

interface MenuItem {
  key: string
  icon: React.ReactNode
  title: string
  mode?: 'single' | 'cluster'
}
const menuItems: MenuItem[] = [
  {
    key: 'info',
    icon: <HomeOutlined className="hover:text-blue-600" />,
    title: 'Info'
  },
  {
    key: 'config',
    icon: <SettingOutlined className="hover:text-blue-600" />,
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
    icon: <ControlOutlined className="hover:text-blue-600" />,
    title: 'Client'
  },
  {
    key: 'slow-log',
    icon: <UnorderedListOutlined className="hover:text-blue-600" />,
    title: 'Slow Log'
  },
  {
    key: 'memory',
    icon: <CalculatorOutlined className="hover:text-blue-600" />,
    title: 'Memory Analysis'
  },
  {
    key: 'pubsub',
    icon: <BookOutlined className="hover:text-blue-600" />,
    title: 'Subscribe',
    mode: 'single'
  },
  {
    key: 'monitor',
    icon: <MonitorOutlined className="hover:text-blue-600" />,
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
      <Button type="text" size="small" icon={<MenuOutlined />}></Button>
    </Dropdown>
  )
}
export default observer(Menu)
