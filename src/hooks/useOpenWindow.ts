import { openWindow } from '@/utils'
import { type WindowLabel, type WindowOptions } from '@tauri-apps/api/window'
import React from 'react'
export function useOpenWindow(label: WindowLabel, options?: WindowOptions) {
  const [active, setActive] = React.useState(false)

  const open = React.useCallback(async () => {
    return await openWindow(label, options).then((window) => {
      setActive(true)
      window.once('tauri://destroyed', () => {
        setActive(false)
      })
      return window
    })
  }, [label, options])

  return {
    active,
    open
  }
}
