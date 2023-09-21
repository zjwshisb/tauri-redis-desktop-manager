import Log from '@/Layout/ActionBar/components/Log'
import Setting from '@/Layout/ActionBar/components/Setting'
import { Space } from 'antd'
import React from 'react'
import NewConnection from './components/NewConnection'
import Session from './components/Session'
import Migrate from './components/Migrate'

const ActionBar: React.FC = () => {
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
        <div className="flex"></div>
      </div>
    </div>
  )
}

export default ActionBar
