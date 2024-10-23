import React from 'react'
import { observer } from 'mobx-react-lite'
import Template from '../Template'
import { useOpenWindow } from '@/hooks/useOpenWindow'
import { Icon } from '@iconify/react'
const Index: React.FC = () => {
  const { open, active } = useOpenWindow('Log', 'Log', {
    url: 'src/windows/log/index.html'
  })

  return (
    <Template
      title="Log"
      active={active}
      icon={<Icon icon={'icon-park-outline:log'} />}
      onClick={open}
    ></Template>
  )
}
export default observer(Index)
