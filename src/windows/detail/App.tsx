import React from 'react'

import { observer } from 'mobx-react-lite'

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
import Config from '@/components/Page/Config'
import MemoryAnalysis from '@/components/Page/MemoryAnalysis'
import { computed } from 'mobx'
import Terminal from '@/components/Page/Terminal'
import Container from '@/components/Container'

const App: React.FC = () => {
  const store = useStore()

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
    return undefined
  }, [params.cid, store.connection.connections])

  React.useEffect(() => {
    if (connection?.id !== undefined) {
      store.connection.open(connection.id)
    }
  }, [connection?.id, store.connection])

  const children = computed(() => {
    let node = <></>

    if (
      connection !== undefined &&
      connection.open === true &&
      params.key !== undefined
    ) {
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
          node = <Info connection={connection} pageKey={params.key}></Info>
          break
        }
        case 'client': {
          node = <Client connection={connection} pageKey={params.key}></Client>
          break
        }
        case 'monitor': {
          node = (
            <Monitor connection={connection} pageKey={params.key}></Monitor>
          )
          break
        }
        case 'pubsub': {
          node = <Pubsub connection={connection} pageKey={params.key}></Pubsub>
          break
        }
        case 'node': {
          node = <Node connection={connection} pageKey={params.key}></Node>
          break
        }
        case 'slow-log': {
          node = (
            <SlowLog connection={connection} pageKey={params.key}></SlowLog>
          )
          break
        }
        case 'config': {
          node = <Config connection={connection} pageKey={params.key}></Config>
          break
        }
        case 'terminal': {
          node = (
            <Terminal connection={connection} pageKey={params.key}></Terminal>
          )
          break
        }
        case 'memory-analysis': {
          node = (
            <MemoryAnalysis
              connection={connection}
              pageKey={params.key}
            ></MemoryAnalysis>
          )
        }
      }
    }
    return node
  }).get()

  return (
    <AppLayout>
      <Container className="flex-1 w-full flex" level={3}>
        <MacScrollbar className="w-full overflow-scroll" id="container">
          <div>{children}</div>
        </MacScrollbar>
      </Container>
    </AppLayout>
  )
}

export default observer(App)
