import React, { useCallback } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import request from '@/utils/request'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import Page from '..'
import { type UnlistenFn } from '@tauri-apps/api/event'
import XTerm from '@/components/XTerm'
import { type Terminal } from 'xterm'
import { TauriEvent } from '@tauri-apps/api/event'

const Monitor: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = (props) => {
  const eventName = React.useRef<string>()

  const cancelFn = React.useRef<UnlistenFn>()
  const [status, setStatus] = React.useState<0 | 1>(0)

  const search = React.useRef('')

  const { t } = useTranslation()

  const term = React.useRef<Terminal>(null)

  const listen = useCallback(async (cid: number) => {
    const res = await request<string>('pubsub/monitor', cid)
    eventName.current = res.data
    appWindow
      .listen<string>(res.data, (r) => {
        try {
          const message: APP.EventPayload<string> = JSON.parse(r.payload)
          if (search.current !== '') {
            if (
              message.data
                .toLocaleLowerCase()
                .includes(search.current.toLocaleLowerCase())
            ) {
              term.current?.writeln(message.data)
            }
          } else {
            term.current?.writeln(message.data)
          }
        } catch (e) {}
      })
      .then((f) => {
        setStatus(1)
        cancelFn.current = f
        console.log(f)
      })
  }, [])

  const cancel = React.useCallback(() => {
    if (cancelFn.current !== undefined) {
      cancelFn.current()
    }
    if (eventName.current !== undefined) {
      request('pubsub/cancel', 0, {
        name: eventName.current
      })
    }
  }, [])

  React.useEffect(() => {
    appWindow.once(TauriEvent.WINDOW_DESTROYED, () => {
      cancel()
    })
  }, [cancel])

  React.useEffect(() => {
    return cancel
  }, [cancel])

  return (
    <Page pageKey={props.pageKey}>
      <div className="mb-2">
        {status === 0 && (
          <Button
            type="primary"
            onClick={async () => {
              listen(props.connection.id)
            }}
          >
            Start
          </Button>
        )}
        {status === 1 && (
          <Button danger onClick={() => {}}>
            {t('Suspend')}
          </Button>
        )}
      </div>
      <XTerm ref={term} className="h-[600px] w-full" />
      <Input
        className="!w-[200px]"
        placeholder={t('Filter').toString()}
        onChange={(e) => {
          search.current = e.target.value
        }}
      />
    </Page>
  )
}

export default Monitor
