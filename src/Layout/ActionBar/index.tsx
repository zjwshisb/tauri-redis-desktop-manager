import Log from '@/Layout/ActionBar/components/Log'
import Setting from '@/Layout/ActionBar/components/Setting'
import { Space } from 'antd'
import React from 'react'
import NewConnection from './components/NewConnection'
import Session from './components/Session'
import Migrate from './components/Migrate'
import { type WebviewWindow, getAll } from '@tauri-apps/api/window'
import { WindowsOutlined } from '@ant-design/icons'
import { TauriEvent } from '@tauri-apps/api/event'
import { useTauriEvent } from '@/hooks/useTauriEvent'
import Container from '@/components/Container'

const ActionBar: React.FC = () => {
  const [window, setWindow] = React.useState<WebviewWindow[]>(getAll())

  useTauriEvent(TauriEvent.WINDOW_CREATED, () => {
    setWindow(getAll())
  })
  useTauriEvent(TauriEvent.WINDOW_DESTROYED, () => {
    setTimeout(() => {
      setWindow(getAll())
    }, 300)
  })

  return (
    <Container
      className="h-[55px] w-full flex-shrink-0 border-b flex flex-col"
      level={1}
    >
      <div className="flex justify-between items-center flex-1">
        <div className="flex px-4">
          <Space>
            <NewConnection />
            <Setting></Setting>
            <Log />
            <Session />
            <Migrate />
          </Space>
        </div>
        <div className="flex px-4">
          <span className="mr-2">{window.length}</span>
          <WindowsOutlined />
        </div>
      </div>
    </Container>
  )
}

export default ActionBar
