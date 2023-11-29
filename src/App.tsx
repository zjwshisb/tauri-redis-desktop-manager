import React from 'react'
import { observer } from 'mobx-react-lite'
import Pages from './Layout/Pages'
import Connections from './Layout/Connections'
import Keys from './Layout/Keys'

import AppLayout from './components/AppLayout'
import useStore from './hooks/useStore'
import ActionBar from './Layout/ActionBar'

const App: React.FC = () => {
  const store = useStore()
  React.useEffect(() => {
    store.window.setName('main')
  }, [store.window])
  return (
    <AppLayout header={<ActionBar />}>
      {store.connection.connections.length > 0 && <Connections />}
      {store.keyInfo.info !== null && <Keys info={store.keyInfo.info}></Keys>}
      <Pages />
    </AppLayout>
  )
}

export default observer(App)
