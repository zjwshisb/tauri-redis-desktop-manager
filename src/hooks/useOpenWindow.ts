import { openWindow } from '@/utils'
import { WebviewLabel, WebviewOptions } from '@tauri-apps/api/webview'
import { TauriEvent } from '@tauri-apps/api/event'
import { Window } from '@tauri-apps/api/window'
import React from 'react'
export function useOpenWindow(
  label: WebviewLabel,
  title: string,
  options: Partial<WebviewOptions>
) {
  const [active, setActive] = React.useState(false)

  const open = React.useCallback(async () => {
    return await openWindow(label, title, options).then((window) => {
      setActive(true)
      window.once(TauriEvent.WINDOW_DESTROYED, () => {
        console.log('test')
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
