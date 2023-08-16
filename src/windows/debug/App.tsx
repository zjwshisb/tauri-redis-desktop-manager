import React from 'react'
import '@/i18n'
import '@/App.css'
import 'antd/dist/reset.css'
import { Layout, ConfigProvider, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { StyleProvider } from '@ant-design/cssinjs'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { type Locale } from 'antd/es/locale'
import 'mac-scrollbar/dist/mac-scrollbar.css'

import Log from './components/Log'
import Client from './components/Client'
import useStore from '@/hooks/useStore'

const langs: Record<string, Locale> = {
  zh_CN: zhCN,
  en_US: enUS
}

const App: React.FC = () => {
  const { i18n } = useTranslation()

  const locale = React.useMemo(() => {
    return langs[i18n.language]
  }, [i18n.language])

  const store = useStore()

  React.useEffect(() => {
    store.connection.fetchConnections()
  }, [store.connection])

  React.useEffect(() => {
    console.log(store.connection.connections)
  }, [store.connection.connections])

  return (
    <ConfigProvider locale={locale}>
      <StyleProvider hashPriority="high">
        <Layout className="h-full border-t">
          <Layout.Content className="h-full w-full flex bg-white">
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
          </Layout.Content>
        </Layout>
      </StyleProvider>
    </ConfigProvider>
  )
}

export default observer(App)
