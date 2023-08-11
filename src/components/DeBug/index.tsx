import { Button } from 'antd'
import React from 'react'
import { observer } from 'mobx-react-lite'
import { BugOutlined } from '@ant-design/icons'

import { WebviewWindow } from '@tauri-apps/api/window'
const Index: React.FC = () => {
  return (
    <Button
      icon={<BugOutlined />}
      size="large"
      onClick={() => {
        const webview = new WebviewWindow('logs', {
          url: '/log/index.html',
          title: 'Log'
        })
        webview.once('tauri://created', function () {
          // webview window successfully created
        })
        webview.once('tauri://error', function (e) {
          console.log(e)
          // an error occurred during webview window creation
        })
      }}
    ></Button>
  )
}
export default observer(Index)
