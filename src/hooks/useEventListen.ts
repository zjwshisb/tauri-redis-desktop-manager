import React from 'react'
import { type UnlistenFn, type Event, TauriEvent } from '@tauri-apps/api/event'

import { useLatest } from 'ahooks'
import { isString } from 'lodash'
import { isMainWindow } from '@/utils'
import { appWindow } from '@tauri-apps/api/window'

export function useEventListen<T = string>(
  eventName: string | (() => Promise<string>),
  eventHandle: (e: Event<T>) => void,
  onUnListenCallback: (name: string) => Promise<any>
) {
  const cancelFn = React.useRef<UnlistenFn>()

  const name = React.useRef('')

  const init = React.useRef(false)

  const handleFn = useLatest(eventHandle)

  const callback = useLatest(onUnListenCallback)

  const eventNameRef = React.useRef(async () => {
    if (isString(eventName)) {
      return await Promise.resolve(eventName)
    } else {
      return await eventName()
    }
  })

  const clearFn = React.useCallback(async () => {
    if (cancelFn.current != null) {
      cancelFn.current()
    }
    if (name.current !== '') {
      return await callback.current(name.current)
    }
    await Promise.resolve()
  }, [callback])

  React.useEffect(() => {
    if (!init.current) {
      init.current = true
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
    }
  }, [clearFn, handleFn])

  React.useEffect(() => {
    return () => {
      clearFn()
    }
  }, [clearFn])
}
