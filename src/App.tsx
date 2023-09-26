import React from 'react'
import { observer } from 'mobx-react-lite'
import Pages from './Layout/Pages'
import Connections from './Layout/Connections'
import Keys from './Layout/Keys'

import AppLayout from './components/AppLayout'
import useStore from './hooks/useStore'
import ConnectionForm from './components/ConnectionForm'
import ActionBar from './Layout/ActionBar'

const App: React.FC = () => {
  const store = useStore()
  return (
    <AppLayout className="flex-col">
      <ActionBar />
      <div className="flex flex-1 overflow-hidden">
        <ConnectionForm />
        {store.connection.connections.length > 0 && <Connections />}
        {store.keyInfo.info !== null && <Keys info={store.keyInfo.info}></Keys>}
        <Pages />
      </div>
    </AppLayout>
  )
}

export default observer(App)
