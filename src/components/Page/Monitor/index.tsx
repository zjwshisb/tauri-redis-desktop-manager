import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import request from '@/utils/request'
import Terminal from '@/components/Terminal'
import { type TerminalRow } from '@/components/Terminal/Row'

const Index: React.FC<{
  connection: APP.Connection
}> = (props) => {
  const unListen = React.useRef<() => void>()
  const [name, setName] = React.useState('')

  const [rows, setRows] = React.useState<TerminalRow[]>([])

  const initialized = React.useRef(false)

  React.useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      request<string>('pubsub/monitor', props.connection.id).then((res) => {
        setName(res.data)
      })
    }
  }, [props.connection.id])

  React.useEffect(() => {
    return () => {
      if (name !== '') {
        request('pubsub/cancel', 0, {
          name
        })
      }
    }
  }, [name])

  React.useEffect(() => {
    if (name !== '') {
      appWindow
        .listen<string>(name, (e) => {
          try {
            const message: APP.EventPayload<string> = JSON.parse(e.payload)
            setRows((prev) => {
              prev.push({
                id: message.id,
                message: message.data
              })
              return [...prev]
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
  }, [unListen])

  return (
    <div>
      <Terminal
        className="h-[700px]"
        rows={rows}
        onClear={() => {
          setRows([])
        }}
      ></Terminal>
    </div>
  )
}

export default Index
