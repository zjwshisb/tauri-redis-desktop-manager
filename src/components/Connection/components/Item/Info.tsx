import React from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import Info from '@/components/Page/Info'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { getPageKey } from '@/utils'

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
          const key = getPageKey('info', connection)
          store.page.addPage({
            label: key,
            key,
            children: <Info connection={connection}></Info>
          })
        }}
      />
    </Tooltip>
  )
}
export default observer(Index)
