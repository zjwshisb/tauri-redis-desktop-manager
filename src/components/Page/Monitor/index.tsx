import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import request from '@/utils/request'
import Terminal from '@/components/Terminal'
import { type TerminalRow } from '@/components/Terminal/Row'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import useArrayState from '@/hooks/useArrayState'

const Monitor: React.FC<{
  connection: APP.Connection
}> = (props) => {
  const [eventName, setEventName] = React.useState<string>('')

  const { items, append, clear } = useArrayState<TerminalRow>(100)

  const [stop, setStop] = React.useState(false)

  const { t } = useTranslation()

  React.useEffect(() => {
    request<string>('pubsub/monitor', props.connection.id).then((res) => {
      setEventName(res.data)
    })
  }, [props.connection.id])

  React.useEffect(() => {
    let unListen: undefined | (() => void)
    if (eventName !== null && !stop) {
      appWindow
        .listen<string>(eventName, (r) => {
          try {
            const message: APP.EventPayload<string> = JSON.parse(r.payload)
            append({
              id: message.id,
              message: message.data
            })
          } catch (e) {}
        })
        .then((f) => {
          unListen = f
        })
    }
    return () => {
      if (unListen !== undefined) {
        unListen()
      }
    }
  }, [append, eventName, stop])

  return (
    <div>
      <div className="mb-2">
        {!stop && (
          <Button
            danger
            onClick={() => {
              setStop(true)
            }}
          >
            {t('Suspend')}
          </Button>
        )}
        {stop && (
          <Button
            onClick={() => {
              setStop(false)
            }}
          >
            {t('Continue')}
          </Button>
        )}
      </div>
      <Terminal
        className="h-[500px] w-full"
        rows={items}
        onClear={clear}
      ></Terminal>
    </div>
  )
}

export default Monitor
