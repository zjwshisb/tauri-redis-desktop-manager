import {
  type EventCallback,
  listen,
  type UnlistenFn
} from '@tauri-apps/api/event'
import React from 'react'
import { type WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { useLatest } from 'ahooks'

export function useTauriEvent<T = string>(
  name: string,
  fn: EventCallback<T>,
  webview?: WebviewWindow
) {
  const fnRef = useLatest(fn)
  React.useEffect(() => {
    let cancel: UnlistenFn
    if (webview !== undefined) {
      webview.listen<T>(name, fnRef.current).then((f) => {
        cancel = f
      })
    } else {
      listen<T>(name, fnRef.current).then((f) => {
        cancel = f
      })
    }
    return () => {
      if (cancel !== undefined) {
        cancel()
      }
    }
  }, [fnRef, name, webview])
}
