import Setting from '@/Layout/ActionBar/components/Setting'
import { Space } from 'antd'
import React, { useEffect } from 'react'
import NewConnection from './components/NewConnection'
import Session from './components/Session'
import Migrate from './components/Migrate'
import Collection from './components/Collection'
import { WindowsOutlined } from '@ant-design/icons'
import { TauriEvent } from '@tauri-apps/api/event'
import { useTauriEvent } from '@/hooks/useTauriEvent'
import Container from '@/components/Container'
import Log from '@/Layout/ActionBar/components/Log'
import { getAllWindows, Window } from '@tauri-apps/api/window'

const ActionBar: React.FC = () => {
  const [windows, setWindows] = React.useState<Window[]>([])

  useEffect(() => {
    getAllWindows().then((r) => {
      setWindows(r)
    })
  }, [])
  useTauriEvent(TauriEvent.WINDOW_CREATED, () => {
    getAllWindows().then((r) => {
      setWindows(r)
    })
  })
  useTauriEvent(TauriEvent.WINDOW_DESTROYED, () => {
    getAllWindows().then((r) => {
      setWindows(r)
    })
  })

  return (
    <Container
      className="w-full flex-shrink-0 border-b flex flex-col"
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
            <Collection />
          </Space>
        </div>
        <div className="flex px-4">
          <span className="mr-2">{windows?.length}</span>
          <WindowsOutlined />
        </div>
      </div>
    </Container>
  )
}

export default ActionBar
