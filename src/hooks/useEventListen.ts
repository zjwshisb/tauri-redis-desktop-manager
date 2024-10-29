import React from 'react'
import { type UnlistenFn, type Event, listen } from '@tauri-apps/api/event'

import { useLatest } from 'ahooks'
import { isString } from 'lodash'
import { getCurrentWindow, Window } from '@tauri-apps/api/window'

export function useEventListen<T = string>(
  getNameFn: string | (() => Promise<string>),
  eventHandle: (e: Event<T>) => void,
  window?: Window,
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
      return getNameFn
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

  const listenFn = React.useCallback(async () => {
    let currentWindow = getCurrentWindow()
    if (window) {
      currentWindow = window
    }
    await currentWindow.onCloseRequested(async () => {
        await clearFn()
      })
    const r = await eventNameRef.current()
    name.current = r
    if (window) {
      cancelFn.current = await window.listen(r, handleFn.current)
    } else {
      cancelFn.current = await  listen(r, handleFn.current)
    }
  }, [clearFn, eventNameRef, handleFn, window])

  React.useEffect(() => {
    if (!init.current && immediately) {
      init.current = true
      listenFn().then()
    }
  }, [immediately, listenFn])

  React.useEffect(() => {
    if (immediately) {
      return () => {
        clearFn().then()
      }
    }
  }, [clearFn, immediately])

  return {
    listen: listenFn,
    clear: clearFn
  }
}
