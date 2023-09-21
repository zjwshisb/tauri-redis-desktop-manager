import React from 'react'
import { observer } from 'mobx-react-lite'
import { FileSyncOutlined } from '@ant-design/icons'
import Template from '../Template'
import { useOpenWindow } from '@/hooks/useOpenWindow'
const Sync: React.FC = () => {
  const { open, active } = useOpenWindow('migrate', {
    url: 'src/windows/migrate/index.html',
    title: 'Migrate',
    focus: true
  })

  return (
    <Template
      title="Data Migrate"
      active={active}
      icon={<FileSyncOutlined />}
      onClick={open}
    ></Template>
  )
}
export default observer(Sync)
