import Log from '@/Layout/ActionBar/components/Log'
import Setting from '@/Layout/ActionBar/components/Setting'
import { Space } from 'antd'
import React from 'react'
import NewConnection from './components/NewConnection'
import Session from './components/Session'
import Migrate from './components/Migrate'
import { getAll } from '@tauri-apps/api/window'
import { listen } from '@tauri-apps/api/event'

const ActionBar: React.FC = () => {
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    listen('tauri://window-created', (e) => {
      const all = getAll()
      setCount(all.length)
    })
    listen('tauri://destroyed', () => {
      const all = getAll()
      setCount(all.length)
    })
  }, [])

  return (
    <div className="h-[85px] w-full flex-shrink-0 border-b  bg-[#F1F1F1] flex flex-col">
      <div className="h-[30px]" data-tauri-drag-region="true"></div>
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
        <div className="flex">{count}</div>
      </div>
    </div>
  )
}

export default ActionBar
