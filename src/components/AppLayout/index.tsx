import React from 'react'
import 'xterm/css/xterm.css'

import 'antd/dist/reset.css'

import '@/App.css'
import 'mac-scrollbar/dist/mac-scrollbar.css'
import '@/i18n'
import '@/styles.less'
import { Layout, ConfigProvider, Spin, theme } from 'antd'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { StyleProvider } from '@ant-design/cssinjs'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { type Locale } from 'antd/es/locale'
import classNames from 'classnames'

const langs: Record<string, Locale> = {
  zh_CN: zhCN,
  en_US: enUS
}

const AppLayout: React.FC<
  React.PropsWithChildren<{
    loading?: boolean
    className?: string
    header?: React.ReactNode
  }>
> = ({ children, loading, className, header }) => {
  const { i18n } = useTranslation()

  const locale = React.useMemo(() => {
    return langs[i18n.language]
  }, [i18n.language])

  return (
    <ConfigProvider locale={locale}>
      {loading === true && <Spin spinning={true}></Spin>}
      {(loading === undefined || !loading) && (
        <StyleProvider hashPriority="high">
          <Layout>
            <Layout.Content
              className={classNames([
                'h-screen w-screen bg-white flex flex-col',
                className
              ])}
            >
              {header !== undefined && header}
              <div className="flex flex-1 overflow-hidden">{children}</div>
            </Layout.Content>
          </Layout>
        </StyleProvider>
      )}
    </ConfigProvider>
  )
}

export default observer(AppLayout)
