import React from 'react'

import { observer } from 'mobx-react-lite'

import Key from '@/components/Page/Key'

import Info from '@/components/Page/Info'
import Client from '@/components/Page/Client'
import Monitor from '@/components/Page/Monitor'
import Pubsub from '@/components/Page/Pubsub'
import Node from '@/components/Page/Node'
import { type Page } from '@/store/page'
import SlowLog from '@/components/Page/SlowLog'
import Config from '@/components/Page/Config'
import MemoryAnalysis from '@/components/Page/MemoryAnalysis'
import Terminal from '@/components/Page/Terminal'
import Collection from '@/components/Page/Collection'

const DetailPage: React.FC<
  Omit<Page, 'children' | 'label' | 'name'> & {
    name?: string
  }
> = (props) => {
  const { connection, pageKey, type, db, name } = props

  const children = React.useMemo(() => {
    let node = <></>
    if (connection !== undefined) {
      switch (type) {
        case 'key': {
          if (name !== undefined) {
            node = (
              <Key
                connection={connection}
                name={name}
                pageKey={pageKey}
                db={db}
              ></Key>
            )
          }
          break
        }
        case 'info': {
          node = <Info connection={connection} pageKey={pageKey}></Info>
          break
        }
        case 'client': {
          node = <Client connection={connection} pageKey={pageKey}></Client>
          break
        }
        case 'monitor': {
          node = <Monitor connection={connection} pageKey={pageKey}></Monitor>
          break
        }
        case 'pubsub': {
          node = <Pubsub connection={connection} pageKey={pageKey}></Pubsub>
          break
        }
        case 'node': {
          node = <Node connection={connection} pageKey={pageKey}></Node>
          break
        }
        case 'slow-log': {
          node = <SlowLog connection={connection} pageKey={pageKey}></SlowLog>
          break
        }
        case 'config': {
          node = <Config connection={connection} pageKey={pageKey}></Config>
          break
        }
        case 'terminal': {
          node = <Terminal connection={connection} pageKey={pageKey}></Terminal>
          break
        }

        case 'memory-analysis': {
          node = (
            <MemoryAnalysis
              connection={connection}
              pageKey={pageKey}
            ></MemoryAnalysis>
          )
        }
      }
    }
    if (connection === undefined) {
      switch (type) {
        case 'collection': {
          node = <Collection pageKey={pageKey}></Collection>
          break
        }
      }
    }
    return node
  }, [connection, db, pageKey, name, type])

  return children
}

export default observer(DetailPage)
