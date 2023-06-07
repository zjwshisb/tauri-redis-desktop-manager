import useStore from '@/hooks/useStore'
import { Tooltip } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { getPageKey } from '@/utils'
import { MonitorOutlined } from '@ant-design/icons'
import Monitor from '@/components/Page/Monitor'

const Subscribe: React.FC<{
  connection: APP.Connection
}> = (props) => {
  const { t } = useTranslation()

  const store = useStore()

  return (
    <Tooltip title={t('Monitor')}>
      <MonitorOutlined
        onClick={() => {
          const key = getPageKey('monitor', props.connection)
          store.page.addPage({
            key,
            label: key,
            children: <Monitor connection={props.connection}></Monitor>
          })
        }}
      ></MonitorOutlined>
    </Tooltip>
  )
}

export default Subscribe
