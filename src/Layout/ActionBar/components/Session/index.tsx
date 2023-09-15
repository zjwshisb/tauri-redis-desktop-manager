import React from 'react'
import { observer } from 'mobx-react-lite'
import { BugOutlined } from '@ant-design/icons'
import Template from '../Template'

import { openWindow } from '@/utils'
const Client: React.FC = () => {
  return (
    <Template
      title="Session"
      icon={<BugOutlined />}
      onClick={() => {
        openWindow('session', {
          url: 'src/windows/session/index.html',
          title: 'Session',
          focus: true
        })
      }}
    ></Template>
  )
}
export default observer(Client)
