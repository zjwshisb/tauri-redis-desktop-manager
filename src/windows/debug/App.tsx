import React from 'react'

import { Tabs } from 'antd'
import { observer } from 'mobx-react-lite'

import 'mac-scrollbar/dist/mac-scrollbar.css'

import Log from './components/Log'
import Client from './components/Client'
import AppLayout from '@/components/AppLayout'

const App: React.FC = () => {
  return (
    <AppLayout>
      <Tabs
        className="w-full"
        tabPosition="left"
        items={[
          {
            label: 'Client',
            key: 'client',
            children: <Client />
          },
          {
            label: 'Log',
            key: 'log',
            children: <Log />
          }
        ]}
      ></Tabs>
    </AppLayout>
  )
}

export default observer(App)
