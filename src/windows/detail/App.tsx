import React from 'react'
import '@/i18n'
import '@/App.css'
import 'antd/dist/reset.css'
import { Layout, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { StyleProvider } from '@ant-design/cssinjs'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { type Locale } from 'antd/es/locale'
import 'mac-scrollbar/dist/mac-scrollbar.css'
import Key from '@/components/Page/Key'

import useStore from '@/hooks/useStore'
import useSearchParam from '@/hooks/useSearchParam'
import { MacScrollbar } from 'mac-scrollbar'
import Info from '@/components/Page/Info'
import Client from '@/components/Page/Client'
import Monitor from '@/components/Page/Monitor'
import Pubsub from '@/components/Page/Pubsub'
import Node from '@/components/Page/Node'

const langs: Record<string, Locale> = {
  zh_CN: zhCN,
  en_US: enUS
}

const App: React.FC = () => {
  const { i18n } = useTranslation()

  const locale = React.useMemo(() => {
    return langs[i18n.language]
  }, [i18n.language])

  const store = useStore()

  React.useEffect(() => {
    store.connection.fetchConnections()
  }, [store.connection])

  const params = useSearchParam<
    'name' | 'cid' | 'db' | 'key' | 'type' | 'file' | 'channels'
  >()

  const connection = React.useMemo(() => {
    if (params.cid !== undefined) {
      return store.connection.connections.find((v) => {
        return v.id === parseInt(params.cid as string)
      })
    }
  }, [params.cid, store.connection.connections])

  console.log(params)

  React.useEffect(() => {
    console.log(store.connection.connections)
  }, [store.connection.connections])

  const children = React.useMemo(() => {
    let node = <></>

    if (connection != null) {
      switch (params.type) {
        case 'key': {
          if (
            params.name !== undefined &&
            params.db !== undefined &&
            params.key !== undefined
          ) {
            node = (
              <Key
                connection={connection}
                name={decodeURI(params.name)}
                pageKey={decodeURI(params.key)}
                db={parseInt(params.db)}
              ></Key>
            )
          }
          break
        }
        case 'info': {
          node = <Info connection={connection}></Info>
          break
        }
        case 'client': {
          node = <Client connection={connection}></Client>
          break
        }
        case 'monitor': {
          const file = params.file === undefined ? false : params.file !== '0'
          node = <Monitor connection={connection} file={file}></Monitor>
          break
        }
        case 'pubsub': {
          if (params.channels !== undefined && params.db !== undefined) {
            const channels = params.channels.split(',')
            node = (
              <Pubsub
                db={parseInt(params.db)}
                channels={channels}
                connection={connection}
              ></Pubsub>
            )
          }
          break
        }
        case 'node': {
          node = <Node connection={connection}></Node>
          break
        }
      }
    }
    return node
  }, [
    connection,
    params.channels,
    params.db,
    params.file,
    params.key,
    params.name,
    params.type
  ])

  return (
    <ConfigProvider locale={locale}>
      <StyleProvider hashPriority="high">
        <Layout className="border-t">
          <Layout.Content className="h-screen w-screen flex  bg-white overflow-hidden">
            <MacScrollbar className="p-4  w-full box-border">
              <div className="box-border">{children}</div>
            </MacScrollbar>
          </Layout.Content>
        </Layout>
      </StyleProvider>
    </ConfigProvider>
  )
}

export default observer(App)
