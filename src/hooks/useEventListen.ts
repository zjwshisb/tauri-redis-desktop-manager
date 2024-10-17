import React from 'react'
import { type UnlistenFn, type Event, TauriEvent } from '@tauri-apps/api/event'

import { useLatest } from 'ahooks'
import { isString } from 'lodash'
import { isMainWindow } from '@/utils'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
const appWindow = getCurrentWebviewWindow()

export function useEventListen<T = string>(
  getNameFn: string | (() => Promise<string>),
  eventHandle: (e: Event<T>) => void,
  onUnListenCallback?: (name: string) => Promise<any>,
  immediately = true
) {
  const cancelFn = React.useRef<UnlistenFn>()

  const name = React.useRef('')

  const init = React.useRef(false)

  const handleFn = useLatest(eventHandle)

  const callback = useLatest(onUnListenCallback)

  const eventNameRef = useLatest(async () => {
    if (isString(getNameFn)) {
      return await Promise.resolve(getNameFn)
    } else {
      return await getNameFn()
    }
  })

  const clearFn = React.useCallback(async () => {
    if (cancelFn.current != null) {
      cancelFn.current()
    }
    if (name.current !== '' && callback.current != null) {
      return await callback.current(name.current)
    }
    await Promise.resolve()
  }, [callback])

  const listen = React.useCallback(() => {
    if (!isMainWindow()) {
      appWindow.once(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
        await clearFn()
        appWindow.close()
      })
    }
    eventNameRef.current().then((r) => {
      name.current = r
      appWindow.listen(r, handleFn.current).then((f) => {
        cancelFn.current = f
      })
    })
  }, [clearFn, eventNameRef, handleFn])

  React.useEffect(() => {
    if (!init.current && immediately) {
      init.current = true
      listen()
    }
  }, [immediately, listen])

  React.useEffect(() => {
    return () => {
      clearFn()
    }
  }, [clearFn])

  return {
    listen,
    clear: clearFn
  }
}
