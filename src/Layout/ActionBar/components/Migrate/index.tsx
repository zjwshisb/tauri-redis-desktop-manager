import React from 'react'
import { observer } from 'mobx-react-lite'
import { FileSyncOutlined } from '@ant-design/icons'
import Template from '../Template'
import { useOpenWindow } from '@/hooks/useOpenWindow'
import { useTranslation } from 'react-i18next'
const Sync: React.FC = () => {
  const { t } = useTranslation()

  const { open, active } = useOpenWindow('migrate', {
    url: 'src/windows/migrate/index.html',
    title: t('Data Migrate').toString(),
    focus: true,
    minHeight: 600,
    minWidth: 600
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
