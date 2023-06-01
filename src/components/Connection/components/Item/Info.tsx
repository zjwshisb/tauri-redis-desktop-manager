import React from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import Info from '@/components/Page/Info'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const store = useStore()
  const { t } = useTranslation()

  return (
    <Tooltip title={t('Info')}>
      <InfoCircleOutlined
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
