import React from 'react'
import { observer } from 'mobx-react-lite'
import Right from './Layout/Right'
import Left from './Layout/Left'
import Center from './Layout/Center'

import AppLayout from './components/AppLayout'
import useStore from './hooks/useStore'
import ConnectionForm from './components/ConnectionForm'

const App: React.FC = () => {
  const store = useStore()

  return (
    <AppLayout>
      <ConnectionForm />
      <Left />
      {store.keyInfo.info != null && (
        <Center info={store.keyInfo.info}></Center>
      )}
      <Right />
    </AppLayout>
  )
}

export default observer(App)
