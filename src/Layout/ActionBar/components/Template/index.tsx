import React from 'react'
import { observer } from 'mobx-react-lite'

import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
const Template: React.FC<{
  icon: React.ReactElement
  onClick?: () => void
  title: string
  active?: boolean
}> = ({ icon, onClick, title, active }) => {
  const { t } = useTranslation()

  return (
    <div
      onClick={onClick}
      data-active={active}
      className={classNames(
        'active-able flex flex-col items-center  rounded-lg p-2 min-w-[50px] h-[50px] justify-center overflow-hidden'
      )}
    >
      <div className="text-md">{icon}</div>
      <div className="text-[10px] leading-[12px] break-all overflow-hidden truncate">
        {t(title)}
      </div>
    </div>
  )
}
export default observer(Template)
