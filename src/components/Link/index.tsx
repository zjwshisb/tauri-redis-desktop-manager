import { openWindow } from '@/utils'
import { type WindowOptions } from '@tauri-apps/api/window'
import React from 'react'
import spark from 'spark-md5'
const Link: React.FC<
  React.PropsWithChildren<{
    href: string
    options?: Omit<WindowOptions, 'href'>
  }>
> = ({ href, children, options }) => {
  return (
    <a
      href="#"
      onClick={() => {
        openWindow(spark.hash(href), {
          url: href,
          ...options
        })
      }}
    >
      {children}
    </a>
  )
}
export default Link
