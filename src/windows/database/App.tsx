import React from 'react'

import { observer } from 'mobx-react-lite'

import AppLayout from '@/components/AppLayout'
import useSearchParam from '@/hooks/useSearchParam'
import useStore from '@/hooks/useStore'
import Keys from '@/Layout/Keys'
import Pages from '@/Layout/Pages'
import { computed } from 'mobx'

const App: React.FC = () => {
  const params = useSearchParam<{
    cid: string
    db: string
  }>()

  const store = useStore()

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

  React.useEffect(() => {
    if (connection !== undefined && params.db !== undefined) {
      store.keyInfo.set(connection, parseInt(params.db))
    }
  }, [connection, params.db, store.keyInfo])

  const children = computed(() => {
    if (store.keyInfo.info == null) {
      return <></>
    }
    if (connection === undefined) {
      return <></>
    }
    if (connection.nodes === undefined) {
      return <></>
    }
    return <Keys info={store.keyInfo.info}></Keys>
  })

  return (
    <AppLayout>
      {children.get()}
      <Pages />
    </AppLayout>
  )
}

export default observer(App)
