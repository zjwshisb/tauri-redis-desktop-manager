import React from 'react'
import XTerm from '@/components/XTerm'
import Page from '..'
import request from '@/utils/request'
import { Input } from 'antd'
import { type Terminal as TerminalI } from 'xterm'
import { emit, listen } from '@tauri-apps/api/event'

interface EventName {
  send: string
  receive: string
}

const Terminal: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const event = React.useRef<EventName>()

  const prefix = React.useMemo(() => {
    return `${connection.host}:${connection.port}>`
  }, [connection.host, connection.port])

  const term = React.useRef<TerminalI>(null)

  const [cmd, setCmd] = React.useState('')

  const history = React.useRef<string[]>([])
  const historyIndex = React.useRef(0)

  React.useEffect(() => {
    request<EventName>('terminal/open', connection.id)
      .then((res) => {
        event.current = res.data
        term.current?.writeln('connected')
        listen<APP.EventPayload<string[]>>(event.current.receive, (v) => {
          v.payload.data.forEach((v) => {
            term.current?.writeln(v)
          })
          console.log(v)
        })
      })
      .catch((e) => {
        term.current?.writeln(e)
      })
  }, [connection.id])

  return (
    <Page pageKey={pageKey}>
      <XTerm prefix={prefix} readonly={true} ref={term} />
      <Input
        size="large"
        value={cmd}
        prefix={prefix}
        onChange={(e) => {
          setCmd(e.target.value)
        }}
        classNames={{
          input: '!bg-black !text-white !border-none'
        }}
        onKeyDown={(e) => {
          switch (e.key) {
            case 'ArrowUp': {
              e.preventDefault()
              historyIndex.current -= 1
              if (history.current[historyIndex.current] !== undefined) {
                setCmd(history.current[historyIndex.current])
              }
              if (historyIndex.current < 0) {
                historyIndex.current = 0
              }
              break
            }
            case 'ArrowDown': {
              e.preventDefault()
              historyIndex.current += 1
              if (history.current[historyIndex.current] !== undefined) {
                setCmd(history.current[historyIndex.current])
              }
              if (historyIndex.current >= history.current.length - 1) {
                historyIndex.current = history.current.length - 1
              }
              console.log(historyIndex.current)
              break
            }
            case 'Enter': {
              term.current?.writeln(`> ${cmd}`)
              history.current.push(cmd)
              historyIndex.current = history.current.length
              if (event.current !== undefined) {
                const payload: APP.EventPayload<string[]> = {
                  data: cmd.split(' ').filter((v) => {
                    return v.trim() !== ''
                  }),
                  id: 1,
                  time: '13232',
                  success: false,
                  event: event.current.send
                }
                emit(event.current.send, payload)
              }
              setCmd('')
            }
          }
        }}
        className="!bg-black !text-white !border-none"
      ></Input>
    </Page>
  )
}
export default Terminal
