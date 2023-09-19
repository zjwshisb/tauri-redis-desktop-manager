import React from 'react'
import KeyAnalysis from './Components/KeyAnalysis'
import Stats from './Components/Stats'
import Doctor from './Components/Doctor'
import Page from '..'
import { ConfigProvider, Tabs } from 'antd'
import { versionCompare } from '@/utils'

export interface KeyItem {
  name: string
  memory: number
  types: string
}

const MemoryAnalysis: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const items = React.useMemo(() => {
    const i = [
      {
        label: 'Key Analysis',
        key: 'analysis',
        children: <KeyAnalysis connection={connection} />
      }
    ]
    if (
      connection.version !== undefined &&
      versionCompare(connection.version, '4.0.0') >= 0
    ) {
      i.push({
        label: 'Memory Stats',
        key: 'stats',
        children: <Stats connection={connection} />
      })
      i.push({
        label: 'Memory Doctor',
        key: 'doctor',
        children: <Doctor connection={connection} />
      })
    }
    return i
  }, [connection])

  return (
    <Page pageKey={pageKey}>
      <ConfigProvider>
        <Tabs items={items}></Tabs>
      </ConfigProvider>
    </Page>
  )
}

export default MemoryAnalysis
