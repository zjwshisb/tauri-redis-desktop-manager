import Log from '@/Layout/ActionBar/components/Log'
import Setting from '@/Layout/ActionBar/components/Setting'
import { Space } from 'antd'
import React, { useEffect } from 'react'
import NewConnection from './components/NewConnection'
import Session from './components/Session'
import Migrate from './components/Migrate'
import Collection from './components/Collection'
import {
  type WebviewWindow,
  getAllWebviewWindows
} from '@tauri-apps/api/webviewWindow'
import { WindowsOutlined } from '@ant-design/icons'
import { TauriEvent } from '@tauri-apps/api/event'
import { useTauriEvent } from '@/hooks/useTauriEvent'
import Container from '@/components/Container'

const ActionBar: React.FC = () => {
  const [window, setWindow] = React.useState<WebviewWindow[]>()

  useEffect(() => {
    getAllWebviewWindows().then((r) => {
      setWindow(r)
    })
  }, [])

  useTauriEvent(TauriEvent.WINDOW_CREATED, () => {
    getAllWebviewWindows().then((r) => {
      setWindow(r)
    })
  })
  useTauriEvent(TauriEvent.WINDOW_DESTROYED, () => {
    setTimeout(() => {
      setWindow([])
    }, 300)
  })

  return (
    <Container
      className="w-full flex-shrink-0 border-b flex flex-col"
      level={1}
    >
      <div className="flex justify-between items-center flex-1 py-2">
        <div className="flex px-4">
          <Space>
            <NewConnection />
            <Setting></Setting>
            <Log />
            <Session />
            <Migrate />
            <Collection />
          </Space>
        </div>
        <div className="flex px-4">
          <span className="mr-2">{window?.length || 0}</span>
          <WindowsOutlined />
        </div>
      </div>
    </Container>
  )
}

export default ActionBar
