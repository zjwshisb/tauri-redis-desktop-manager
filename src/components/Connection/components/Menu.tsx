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
import { Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import { getPageKey } from '@/utils'
import Client from '@/components/Page/Client'
import Info from '@/components/Page/Info'
import Node from '@/components/Page/Node'
import SlowLog from '@/components/Page/SlowLog'
import Config from '@/components/Page/Config'
import MemoryAnalysis from '@/components/Page/MemoryAnalysis'
import Pubsub from '@/components/Page/Pubsub'
import Monitor from '@/components/Page/Monitor'

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
              const key = getPageKey('client', connection)
              store.page.addPage({
                label: key,
                connection,
                type: 'client',
                key,
                children: (
                  <Client connection={connection} pageKey={key}></Client>
                )
              })
              break
            }
            case 'info': {
              const key = getPageKey('info', connection)
              store.page.addPage({
                label: key,
                type: 'info',
                key,
                children: <Info connection={connection} pageKey={key}></Info>,
                connection
              })
              break
            }
            case 'node': {
              const key = getPageKey('node', connection)
              store.page.addPage({
                label: key,
                type: 'node',
                key,
                children: <Node connection={connection} pageKey={key}></Node>,
                connection
              })
              break
            }
            case 'slow-log': {
              const key = getPageKey('slow-log', connection)
              store.page.addPage({
                label: key,
                type: 'slow-log',
                key,
                children: (
                  <SlowLog connection={connection} pageKey={key}></SlowLog>
                ),
                connection
              })
              break
            }
            case 'config': {
              const key = getPageKey('config', connection)
              store.page.addPage({
                label: key,
                type: 'config',
                key,
                children: (
                  <Config connection={connection} pageKey={key}></Config>
                ),
                connection
              })
              break
            }
            case 'memory': {
              const key = getPageKey('memory', connection)
              store.page.addPage({
                label: key,
                type: 'memory-analysis',
                key,
                children: (
                  <MemoryAnalysis
                    connection={connection}
                    pageKey={key}
                  ></MemoryAnalysis>
                ),
                connection
              })
              break
            }
            case 'pubsub': {
              const key = getPageKey('pubsub', connection)
              store.page.addPage({
                label: key,
                type: 'pubsub',
                key,
                children: (
                  <Pubsub connection={connection} pageKey={key}></Pubsub>
                ),
                connection
              })
              break
            }
            case 'monitor': {
              const key = getPageKey('monitor', connection)
              store.page.addPage({
                label: key,
                type: 'monitor',
                key,
                children: <Monitor connection={connection} pageKey={key} />,
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
