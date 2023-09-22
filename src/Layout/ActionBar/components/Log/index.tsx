import React from 'react'
import { observer } from 'mobx-react-lite'
import { HistoryOutlined } from '@ant-design/icons'
import Template from '../Template'
import { useOpenWindow } from '@/hooks/useOpenWindow'
import { useTranslation } from 'react-i18next'
const Index: React.FC = () => {
  const { t } = useTranslation()

  const { open, active } = useOpenWindow('Log', {
    url: 'src/windows/log/index.html',
    title: t('Log').toString(),
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
