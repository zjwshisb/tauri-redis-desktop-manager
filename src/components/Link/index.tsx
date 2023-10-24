import React from 'react'
import { open } from '@tauri-apps/api/shell'
const Link: React.FC<
  React.PropsWithChildren<{
    href: string
    className?: string
  }>
> = ({ href, children, className }) => {
  return (
    <a
      className={className}
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
