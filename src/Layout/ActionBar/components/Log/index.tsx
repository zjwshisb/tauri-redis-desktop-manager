import React from 'react'
import { observer } from 'mobx-react-lite'
import { HistoryOutlined } from '@ant-design/icons'
import Template from '../Template'
import { useOpenWindow } from '@/hooks/useOpenWindow'
const Index: React.FC = () => {
  const { open, active } = useOpenWindow('Log', {
    url: 'src/windows/log/index.html',
    title: 'log',
    focus: true
  })

  return (
    <Template
      title="Log"
      active={active}
      icon={<HistoryOutlined />}
      onClick={open}
    ></Template>
  )
}
export default observer(Index)
