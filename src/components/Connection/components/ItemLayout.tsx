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
        'h-[22px] flex items-center px-4 justify-between',
        clickAble ? 'hover:cursor-pointer' : '',
        active ? 'bg-blue-400 text-white' : '',
        clickAble && !active ? 'hover:bg-gray-50' : ''
      ])}
    >
      {children}
    </div>
  )
}
export default ItemLayout
