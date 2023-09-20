import React from 'react'
import { observer } from 'mobx-react-lite'
import { BugOutlined } from '@ant-design/icons'
import Template from '../Template'
import { useOpenWindow } from '@/hooks/useOpenWindow'

const Client: React.FC = () => {
  const { open, active } = useOpenWindow('Session', {
    url: 'src/windows/session/index.html',
    title: 'debug',
    focus: true
  })

  return (
    <Template
      title="Session"
      active={active}
      icon={<BugOutlined />}
      onClick={open}
    ></Template>
  )
}
export default observer(Client)
