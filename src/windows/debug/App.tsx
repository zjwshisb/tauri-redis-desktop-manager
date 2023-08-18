import React from 'react'

import { Tabs } from 'antd'
import { observer } from 'mobx-react-lite'

import 'mac-scrollbar/dist/mac-scrollbar.css'

import Log from './components/Log'
import Client from './components/Client'
import useStore from '@/hooks/useStore'
import AppLayout from '@/components/AppLayout'

const App: React.FC = () => {
  const store = useStore()

  React.useEffect(() => {
    store.connection.fetchConnections()
  }, [store.connection])

  React.useEffect(() => {
    console.log(store.connection.connections)
  }, [store.connection.connections])

  return (
    <AppLayout>
      <Tabs
        className="w-full"
        tabPosition="left"
        items={[
          {
            label: 'Log',
            key: 'log',
            children: <Log />
          },
          {
            label: 'Client',
            key: 'client',
            children: <Client />
          }
        ]}
      ></Tabs>
    </AppLayout>
  )
}

export default observer(App)
