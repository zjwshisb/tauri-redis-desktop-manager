import React from 'react'
import classnames from 'classnames'

const ItemLayout: React.FC<
  React.PropsWithChildren<{
    active: boolean
  }>
> = ({ children, active }) => {
  return (
    <div
      data-active={active}
      className={classnames([
        'active-able',
        'h-[24px] flex items-center px-4 justify-between'
      ])}
    >
      {children}
    </div>
  )
}
export default ItemLayout
