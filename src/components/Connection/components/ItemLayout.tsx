import React from 'react'
import classnames from 'classnames'

const ItemLayout: React.FC<
  React.PropsWithChildren<{
    active: boolean
    clickAble: boolean
  }>
> = ({ children, active, clickAble }) => {
  return (
    <div
      className={classnames([
        'h-[22px] flex items-center px-2 rounded justify-between',
        clickAble ? 'hover:cursor-pointer' : '',
        active ? 'bg-blue-50' : '',
        clickAble && !active ? 'hover:bg-gray-50' : ''
      ])}
    >
      {children}
    </div>
  )
}
export default ItemLayout
