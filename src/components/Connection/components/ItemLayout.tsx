import React from 'react'
import classnames from 'classnames'

const ItemLayout: React.FC<
  React.PropsWithChildren<{
    active: boolean
  }>
> = ({ children, active }) => {
  return (
    <div
      className={classnames([
        'h-[22px] flex items-center px-2 rounded hover:cursor-pointer justify-between',
        active ? 'bg-blue-50' : 'hover:bg-gray-100'
      ])}
    >
      {children}
    </div>
  )
}
export default ItemLayout
