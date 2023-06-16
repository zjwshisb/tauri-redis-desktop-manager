import React from 'react'
import './i18n'
import './App.css'
import 'antd/dist/reset.css'
import { Layout, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import Right from './Layout/Right'
import { StyleProvider } from '@ant-design/cssinjs'
import Left from './Layout/Left'
import Center from './Layout/Center'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { type Locale } from 'antd/es/locale'

const langs: Record<string, Locale> = {
  zh_CN: zhCN,
  en_US: enUS
}

const App: React.FC = () => {
  const { i18n } = useTranslation()

  const locale = React.useMemo(() => {
    return langs[i18n.language]
  }, [i18n.language])

  return (
    <ConfigProvider locale={locale}>
      <StyleProvider hashPriority="high">
        <Layout className="h-full bg-[#FFF] border-t">
          <Layout.Content className="flex">
            <Left />
            <Center />
            <Right />
          </Layout.Content>
        </Layout>
      </StyleProvider>
    </ConfigProvider>
  )
}

export default observer(App)
