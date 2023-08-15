import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import request from '@/utils/request'
import Terminal from '@/components/Terminal'
import { type TerminalRow } from '@/components/Terminal/Row'
import { useTranslation } from 'react-i18next'

interface MonitorResp {
  event_name: string
  file_name: string
}

const Monitor: React.FC<{
  connection: APP.Connection
  file?: boolean
}> = (props) => {
  const unListen = React.useRef<() => void>()
  const [name, setName] = React.useState<MonitorResp>()

  const [rows, setRows] = React.useState<TerminalRow[]>([])

  const initialized = React.useRef(false)

  const { file = false } = props

  const { t } = useTranslation()

  React.useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      request<MonitorResp>('pubsub/monitor', props.connection.id, {
        file
      }).then((res) => {
        setName(res.data)
      })
    }
  }, [file, props.connection.id])

  React.useEffect(() => {
    return () => {
      if (name !== undefined && name.event_name !== '') {
        request('pubsub/cancel', 0, {
          name: name?.event_name
        })
      }
    }
  }, [name])

  React.useEffect(() => {
    if (name !== undefined && name.event_name !== '') {
      appWindow
        .listen<string>(name.event_name, (r) => {
          try {
            const message: APP.EventPayload<string> = JSON.parse(r.payload)
            setRows((prev) => {
              return [...prev].concat([
                {
                  id: message.id,
                  message: message.data
                }
              ])
            })
          } catch (e) {}
        })
        .then((f) => {
          unListen.current = f
        })
    }
  }, [name])

  React.useEffect(() => {
    return () => {
      if (unListen.current !== undefined) {
        unListen.current()
      }
    }
  }, [])

  const fileName = React.useMemo(() => {
    if (name !== undefined) {
      if (name.file_name !== '') {
        return (
          <div>
            {t('Log File')} : {name.file_name}
          </div>
        )
      }
    }
  }, [name, t])

  return (
    <div>
      <Terminal
        className="h-[500px]"
        rows={rows}
        onClear={() => {
          setRows([])
        }}
      ></Terminal>
      {fileName}
    </div>
  )
}

export default Monitor
