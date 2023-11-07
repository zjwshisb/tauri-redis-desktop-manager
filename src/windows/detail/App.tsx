import React from 'react'

import { observer } from 'mobx-react-lite'

import useStore from '@/hooks/useStore'
import useSearchParam from '@/hooks/useSearchParam'
import { MacScrollbar } from 'mac-scrollbar'

import { type Page } from '@/store/page'
import AppLayout from '@/components/AppLayout'
import Container from '@/components/Container'
import DetailPage from '@/components/Page/DetailPage'

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

  if (params.key === undefined || params.type === undefined) {
    return <></>
  }

  return (
    <AppLayout>
      <Container className="flex-1 w-full flex" level={4}>
        <MacScrollbar className="w-full overflow-scroll" id="container">
          <div>
            <DetailPage
              connection={connection}
              pageKey={params.key}
              type={params.type}
              name={params.name}
              db={params.db !== undefined ? parseInt(params.db) : undefined}
            ></DetailPage>
          </div>
        </MacScrollbar>
      </Container>
    </AppLayout>
  )
}

export default observer(App)
