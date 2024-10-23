import React from 'react'
import { observer } from 'mobx-react-lite'
import Template from '../Template'
import { useOpenWindow } from '@/hooks/useOpenWindow'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
const Sync: React.FC = () => {
  const { t } = useTranslation()

  const { open, active } = useOpenWindow(
    'migrate',
    t('Data Migrate').toString(),
    {
      url: 'src/windows/migrate/index.html'
    }
  )

  return (
    <Template
      title="Data Migrate"
      active={active}
      icon={<Icon icon={'carbon:migrate'} />}
      onClick={open}
    ></Template>
  )
}
export default observer(Sync)
