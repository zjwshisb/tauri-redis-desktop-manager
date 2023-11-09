import React from 'react'
import XTerm from '@/components/XTerm'
import Page from '..'
import request from '@/utils/request'
import { Input, AutoComplete } from 'antd'
import { type Terminal as TerminalI } from 'xterm'
import { emit } from '@tauri-apps/api/event'
import { isArray, isNumber, isString } from 'lodash'
import { useEventListen } from '@/hooks/useEventListen'

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

  const printData = React.useCallback((data: any, prefix = '') => {
    if (isString(data)) {
      term.current?.writeln(`${prefix} "${data}"`)
    }
    if (isNumber(data)) {
      term.current?.writeln(`${prefix} ${data}`)
    }
    if (isArray(data)) {
      if (data.length === 0) {
        printData('(empty array)', prefix)
      }
      data.forEach((v, index) => {
        if (index === 0) {
          printData(v, prefix + ` ${index})`)
        } else {
          printData(v, ' '.repeat(prefix.length) + ` ${index})`)
        }
      })
    }
  }, [])

  useEventListen<APP.EventPayload<any>>(
    async () => {
      return await request<EventName>('terminal/open', connection.id).then(
        (res) => {
          setEvent(res.data)
          setTimeout(() => {
            term.current?.writeln('connected')
          }, 200)
          return res.data.receive
        }
      )
    },
    (v) => {
      const data = v.payload.data
      if (v.payload.success) {
        printData(data)
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

  const term = React.useRef<TerminalI>(null)

  const [cmd, setCmd] = React.useState('')

  const history = React.useRef<string[]>([])
  const historyIndex = React.useRef(0)

  return (
    <Page pageKey={pageKey}>
      <XTerm className="rounded-b-none" ref={term} />
      <AutoComplete
        size="large"
        value={cmd}
        bordered={false}
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
              term.current?.writeln(`> ${cmd}`)
              history.current.push(cmd)
              historyIndex.current = history.current.length
              if (event !== undefined) {
                const payload: APP.EventPayload<string[]> = {
                  data: cmd.split(' ').filter((v) => {
                    return v.trim() !== ''
                  }),
                  id: 1,
                  time: '13232',
                  success: true,
                  event: event.send
                }
                emit(event.send, payload)
              }
              setCmd('')
            }
          }
        }}
      >
        <Input
          bordered={false}
          className="!rounded-t-none !bg-black !text-white"
          prefix={prefix}
          classNames={{
            input: '!bg-black !text-white rounded-t-none'
          }}
        />
      </AutoComplete>
    </Page>
  )
}
export default Terminal
