import React from 'react'
import { open } from '@tauri-apps/api/shell'
import classNames from 'classnames'
const Link: React.FC<
  React.PropsWithChildren<{
    href: string
    className?: string
  }>
> = ({ href, children, className }) => {
  return (
    <a
      className={classNames([className, 'text-blue-600'])}
      href="#"
      onClick={() => {
        open(href)
      }}
    >
      {children}
    </a>
  )
}
export default Link
