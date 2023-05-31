import React from 'react'
import { SettingOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import Info from '@/components/Page/Info'
import { Tooltip } from 'antd'

const Index: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const store = useStore()

  return (
    <Tooltip title="Info">
      <SettingOutlined
        className="hover:text-blue-600"
        onClick={(e) => {
          e.stopPropagation()
          store.page.addPage({
            label: `info|${connection.host}:${connection.port}`,
            key: `info|${connection.host}:${connection.port}`,
            children: <Info connection={connection}></Info>
          })
        }}
      />
    </Tooltip>
  )
}
export default observer(Index)
