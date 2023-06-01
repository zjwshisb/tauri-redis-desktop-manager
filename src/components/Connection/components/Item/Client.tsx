import React from 'react'
import { ControlOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import Client from '@/components/Page/Client'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const store = useStore()

  const { t } = useTranslation()

  return (
    <Tooltip title={t('Client')}>
      <ControlOutlined
        className="hover:text-blue-600"
        onClick={(e) => {
          e.stopPropagation()
          store.page.addPage({
            label: `client|${connection.host}:${connection.port}`,
            key: `client|${connection.host}:${connection.port}`,
            children: <Client connection={connection}></Client>
          })
        }}
      ></ControlOutlined>
    </Tooltip>
  )
}
export default observer(Index)
