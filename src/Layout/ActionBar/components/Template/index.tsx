import React from 'react'
import { observer } from 'mobx-react-lite'

import { useTranslation } from 'react-i18next'
const Template: React.FC<{
  icon: React.ReactElement
  onClick?: () => void
  title: string
}> = ({ icon, onClick, title }) => {
  const { t } = useTranslation()

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center hover:bg-black/[0.06] rounded-lg p-2 hover:cursor-pointer min-w-[50px] h-[50px] justify-center overflow-hidden"
    >
      <div className="text-md">{icon}</div>
      <div className="text-[10px] leading-[12px] break-all overflow-hidden truncate">
        {t(title)}
      </div>
    </div>
  )
}
export default observer(Template)
