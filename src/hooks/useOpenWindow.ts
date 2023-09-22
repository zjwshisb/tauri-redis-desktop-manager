import { openWindow } from '@/utils'
import { type WindowLabel, type WindowOptions } from '@tauri-apps/api/window'
import { useLatest } from 'ahooks'
import React from 'react'
export function useOpenWindow(
  label: WindowLabel,
  options: WindowOptions = {
    focus: true
  }
) {
  const opt = useLatest(options)

  const [active, setActive] = React.useState(false)

  const open = React.useCallback(async () => {
    return await openWindow(label, opt.current).then((window) => {
      setActive(true)
      window.once('tauri://destroyed', () => {
        setActive(false)
      })
      return window
    })
  }, [label, opt])

  return {
    active,
    open
  }
}
