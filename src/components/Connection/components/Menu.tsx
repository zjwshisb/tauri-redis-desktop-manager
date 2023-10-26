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
              store.page.addCreatePage(
                {
                  connection,
                  type: 'client',
                  name: 'client'
                },
                ({ key }) => (
                  <Client connection={connection} pageKey={key}></Client>
                )
              )
              break
            }
            case 'info': {
              store.page.addCreatePage(
                {
                  type: 'info',
                  name: 'info',
                  connection
                },
                ({ key }) => <Info connection={connection} pageKey={key}></Info>
              )
              break
            }
            case 'node': {
              store.page.addCreatePage(
                {
                  type: 'node',
                  name: 'node',
                  connection
                },
                ({ key }) => <Node connection={connection} pageKey={key}></Node>
              )
              break
            }
            case 'slow-log': {
              store.page.addCreatePage(
                {
                  type: 'slow-log',
                  name: 'slow-log',
                  connection
                },
                ({ key }) => (
                  <SlowLog connection={connection} pageKey={key}></SlowLog>
                )
              )
              break
            }
            case 'config': {
              store.page.addCreatePage(
                {
                  type: 'config',
                  name: 'config',
                  connection
                },
                ({ key }) => (
                  <Config connection={connection} pageKey={key}></Config>
                )
              )
              break
            }
            case 'memory': {
              store.page.addCreatePage(
                {
                  type: 'memory-analysis',
                  name: 'memory-analysis',

                  connection
                },
                ({ key }) => (
                  <MemoryAnalysis
                    connection={connection}
                    pageKey={key}
                  ></MemoryAnalysis>
                )
              )
              break
            }
            case 'pubsub': {
              store.page.addCreatePage(
                {
                  type: 'pubsub',
                  name: 'pubsub',

                  connection
                },
                ({ key }) => (
                  <Pubsub connection={connection} pageKey={key}></Pubsub>
                )
              )
              break
            }
            case 'monitor': {
              store.page.addCreatePage(
                {
                  type: 'monitor',
                  name: 'monitor',
                  connection
                },
                ({ key }) => <Monitor connection={connection} pageKey={key} />
              )
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
