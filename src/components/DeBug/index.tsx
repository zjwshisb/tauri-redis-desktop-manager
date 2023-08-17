import { Button } from 'antd'
import React from 'react'
import { observer } from 'mobx-react-lite'
import { BugOutlined } from '@ant-design/icons'

import { openWindow } from '@/utils'
const Index: React.FC = () => {
  return (
    <Button
      icon={<BugOutlined />}
      size="large"
      onClick={() => {
        openWindow('debug', {
          url: 'src/windows/debug/index.html',
          title: 'debug',
          focus: true
        })
      }}
    ></Button>
  )
}
export default observer(Index)
