import React from 'react'
import { type UnlistenFn, type Event, TauriEvent } from '@tauri-apps/api/event'
import { useTranslation } from 'react-i18next'
import request from '@/utils/request'
import { appWindow } from '@tauri-apps/api/window'
import { isMainWindow } from '@/utils'
import { App } from 'antd'
import { useLatest } from 'ahooks'

export function useEventListener<T = string>(handle: (e: Event<T>) => void) {
  const cancelFn = React.useRef<UnlistenFn>()

  const { t } = useTranslation()

  const handleFn = useLatest(handle)

  const eventName = React.useRef('')

  const { modal } = App.useApp()

  const listen = React.useCallback(
    async (name: string) => {
      eventName.current = name
      appWindow
        .listen<T>(name, (r) => {
          handleFn.current(r)
        })
        .then((f) => {
          cancelFn.current = f
        })
    },
    [handleFn]
  )

  const cancel = React.useCallback(async () => {
    if (cancelFn.current !== undefined) {
      cancelFn.current()
      cancelFn.current = undefined
    }
    if (eventName.current !== '') {
      await request('pubsub/cancel', 0, {
        name: eventName.current
      }).then(() => {
        eventName.current = ''
      })
    }
  }, [])

  React.useEffect(() => {
    if (!isMainWindow()) {
      let unListen: UnlistenFn
      appWindow
        .listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
          try {
            modal.confirm({
              title: t('Notice'),
              content: 'Are you sure close this window?',
              onOk: async () => {
                await cancel()
                await appWindow.close()
              }
            })
          } catch (e) {
            await cancel()
            await appWindow.close()
          }
        })
        .then((r) => {
          unListen = r
        })
      return () => {
        if (unListen !== undefined) {
          unListen()
        }
      }
    }
  }, [cancel, modal, t])

  React.useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  return {
    listen,
    cancel
  }
}
