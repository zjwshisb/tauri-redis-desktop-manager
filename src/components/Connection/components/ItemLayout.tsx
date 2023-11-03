import React from 'react'
import classnames from 'classnames'
import InteractiveContainer from '@/components/InteractiveContainer'

const ItemLayout: React.FC<
  React.PropsWithChildren<{
    active: boolean
  }>
> = ({ children, active }) => {
  return (
    <InteractiveContainer
      active={active}
      className={classnames([
        'h-[24px] flex items-center px-4 justify-between'
      ])}
    >
      {children}
    </InteractiveContainer>
  )
}
export default ItemLayout
