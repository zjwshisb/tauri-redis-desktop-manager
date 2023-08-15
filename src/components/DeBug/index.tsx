import { Button, message } from 'antd'
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
        const webview = new WebviewWindow('debug', {
          url: 'src/windows/debug/index.html',
          title: 'debug',
          focus: true
        })
        webview.once('tauri://created', function () {
          // webview window successfully created
        })
        webview.once('tauri://error', function (e) {
          message.error(e.payload as string)
          console.log(e)
          // an error occurred during webview window creation
        })
      }}
    ></Button>
  )
}
export default observer(Index)
