import React from 'react'

import { observer } from 'mobx-react-lite'

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
import { type Page } from '@/store/page'
import SlowLog from '@/components/Page/SlowLog'
import AppLayout from '@/components/AppLayout'
import { FloatButton } from 'antd'
import Config from '@/components/Page/Config'
import MemoryAnalysis from '@/components/Page/MemoryAnalysis'

const App: React.FC = () => {
  const store = useStore()

  React.useEffect(() => {
    store.connection.fetchConnections()
  }, [store.connection])

  const params = useSearchParam<{
    name: string
    cid: string
    db: string
    key: string
    type: Page['type']
    file: string
    channels: string
  }>()

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
        case 'slow-log': {
          node = <SlowLog connection={connection}></SlowLog>
          break
        }
        case 'config': {
          node = <Config connection={connection}></Config>
          break
        }
        case 'memory-analysis': {
          node = <MemoryAnalysis connection={connection}></MemoryAnalysis>
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
    <AppLayout>
      <MacScrollbar className="p-4  w-full box-border" id="container">
        <FloatButton.BackTop
          target={() => {
            const target = document.getElementById('container')
            return target as HTMLElement
          }}
        />
        <div className="box-border">{children}</div>
      </MacScrollbar>
    </AppLayout>
  )
}

export default observer(App)
