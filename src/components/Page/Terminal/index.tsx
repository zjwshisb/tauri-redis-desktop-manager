import React from 'react'
import XTerm, { type XTermAction } from '@/components/XTerm'
import Page from '..'
import request from '@/utils/request'
import { Input, AutoComplete, Space } from 'antd'
import { emit } from '@tauri-apps/api/event'
import { useEventListen } from '@/hooks/useEventListen'
import CusButton from '@/components/CusButton'

interface EventName {
  send: string
  receive: string
}

const Terminal: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const [event, setEvent] = React.useState<EventName>()

  const clear = React.useCallback(async () => {
    if (event !== undefined) {
      return await request('terminal/cancel', 0, {
        id: event.send
      })
    }
  }, [event])

  useEventListen<APP.EventPayload<any>>(
    async () => {
      return await request<EventName>('terminal/open', connection.id).then(
        (res) => {
          setEvent(res.data)
          setTimeout(() => {
            term.current?.writeln('connected...')
          }, 200)
          return res.data.receive
        }
      )
    },
    (v) => {
      const data = v.payload.data
      if (v.payload.success) {
        term.current?.writeRedisResult(data)
      } else {
        term.current?.writeln(`(error) Err ${data as string}`)
      }
      term.current?.scrollToBottom()
    },
    clear
  )

  const prefix = React.useMemo(() => {
    return `${connection.host}:${connection.port}>`
  }, [connection.host, connection.port])

  const term = React.useRef<XTermAction>(null)

  const [cmd, setCmd] = React.useState('')

  const history = React.useRef<string[]>([])
  const historyIndex = React.useRef(0)

  return (
    <Page pageKey={pageKey}>
      <XTerm className="rounded-b-none" ref={term} />
      <AutoComplete
        value={cmd}
        className="w-full"
        options={[]}
        onChange={(e) => {
          setCmd(e)
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
              const parseCmd = cmd
                .split(' ')
                .map((v) => v.trim())
                .filter((v) => v !== '')
              if (parseCmd.length > 0) {
                const cmdStr = parseCmd.join(' ')
                term.current?.writeln(`> ${cmdStr}`)
                history.current.push(cmdStr)
                historyIndex.current = history.current.length
                if (event !== undefined) {
                  const payload: APP.EventPayload<string[]> = {
                    data: parseCmd,
                    id: 1,
                    time: '13232',
                    success: true,
                    event: event.send
                  }
                  emit(event.send, payload)
                }
              }
              setCmd('')
            }
          }
        }}
      >
        <Input
          className="!rounded-t-none !bg-black !text-white"
          prefix={prefix}
          classNames={{
            input: '!bg-black !text-white rounded-t-none'
          }}
        />
      </AutoComplete>
      <div className="pt-2">
        <Space>
          <span>
            <CusButton
              onClick={() => {
                term.current?.clear()
              }}
            >
              Clear
            </CusButton>
          </span>
          <span>
            Enter to execute command, Arrow Down/Arrow Up to switch history
          </span>
        </Space>
      </div>
    </Page>
  )
}
export default Terminal
