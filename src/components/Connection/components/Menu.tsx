import React from 'react'
import {
  HomeOutlined,
  ControlOutlined,
  MenuOutlined,
  NodeIndexOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  CalculatorOutlined
} from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import Monitor from './Monitor'
import { getPageKey } from '@/utils'
import Client from '@/components/Page/Client'
import Info from '@/components/Page/Info'
import Subscribe from './Subscribe'
import Node from '@/components/Page/Node'
import SlowLog from '@/components/Page/SlowLog'
import Config from '@/components/Page/Config'
import MemoryAnalysis from '@/components/Page/MemoryAnalysis'

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
      },
      {
        key: 'slow-log',
        label: (
          <div className="flex">
            <UnorderedListOutlined className="hover:text-blue-600" />
            <div className="ml-2">{t('Slow Log')}</div>
          </div>
        )
      },
      {
        key: 'config',
        label: (
          <div className="flex">
            <SettingOutlined className="hover:text-blue-600" />
            <div className="ml-2">{t('Config')}</div>
          </div>
        )
      },
      {
        key: 'memory',
        label: (
          <div className="flex">
            <CalculatorOutlined className="hover:text-blue-600" />
            <div className="ml-2">{t('Memory Analysis')}</div>
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
    if (connection.is_cluster) {
      menus = menus.concat([
        {
          key: 'node',
          label: (
            <div className="flex">
              <NodeIndexOutlined className="hover:text-blue-600" />
              <div className="ml-2">{t('Node')}</div>
            </div>
          )
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
            case 'node': {
              const key = getPageKey('node', connection)
              store.page.addPage({
                label: key,
                type: 'node',
                key,
                children: <Node connection={connection}></Node>,
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
                children: <SlowLog connection={connection}></SlowLog>,
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
                children: <Config connection={connection}></Config>,
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
                  <MemoryAnalysis connection={connection}></MemoryAnalysis>
                ),
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
