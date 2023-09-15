import React from 'react'
import { observer } from 'mobx-react-lite'
import { HistoryOutlined } from '@ant-design/icons'
import Template from '../Template'

import { openWindow } from '@/utils'
const Index: React.FC = () => {
  return (
    <Template
      title="Log"
      icon={<HistoryOutlined />}
      onClick={() => {
        openWindow('Log', {
          url: 'src/windows/log/index.html',
          title: 'log',
          focus: true
        })
      }}
    ></Template>
  )
}
export default observer(Index)
