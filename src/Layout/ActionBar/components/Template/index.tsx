import React from 'react'
import { observer } from 'mobx-react-lite'

import { useTranslation } from 'react-i18next'
import InteractiveContainer from '@/components/InteractiveContainer'
const Template: React.FC<{
  icon: React.ReactElement
  onClick?: () => void
  title: string
  active?: boolean
}> = ({ icon, onClick, title, active }) => {
  const { t } = useTranslation()

  return (
    <InteractiveContainer
      onClick={onClick}
      active={active}
      className="flex flex-col items-center  rounded-lg px-2 py-2   min-w-[50px]  justify-center overflow-hidden"
    >
      <div className="text-md flex mb-1">{icon}</div>
      <div className="text-[10px] leading-[12px] break-all overflow-hidden truncate">
        {t(title)}
      </div>
    </InteractiveContainer>
  )
}
export default observer(Template)
