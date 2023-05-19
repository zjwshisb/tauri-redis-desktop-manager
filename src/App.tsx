import React from 'react'

import { Layout, ConfigProvider } from 'antd'
import Connection from './components/Connection'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import PageContent from './components/PageContent'
import { StyleProvider } from '@ant-design/cssinjs'
import './i18n'
import './App.css'
import 'antd/dist/reset.css'
import KeyContent from './components/KeyContent'

const App: React.FC = () => {
  const { i18n } = useTranslation()

  return <ConfigProvider locale={{
    locale: i18n.language
  }}>
    <StyleProvider hashPriority="high">
      <Layout className='h-full bg-[#FFF]'>
          <Layout.Sider theme="light" width={250}>
            <Connection/>
          </Layout.Sider>
          <Layout.Content className='flex'>
            <KeyContent />
            <PageContent />
          </Layout.Content>
      </Layout>
    </StyleProvider>

  </ConfigProvider>
}

export default observer(App)
