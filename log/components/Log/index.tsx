import React from 'react'
import request from '@/utils/request'
import { event } from '@tauri-apps/api'
import Terminal, { type TerminalRow } from '@/components/Terminal'
import { useMount, useUnmount } from 'ahooks'

const Index: React.FC = () => {
  const [rows, setRows] = React.useState<TerminalRow[]>([])

  const unListenFn = React.useRef<() => void>()

  const init = React.useRef(false)

  useMount(() => {
    if (!init.current) {
      init.current = true
      request('debug/log').then(() => {
        event
          .listen<string>('debug', (e) => {
            const cmd: APP.RedisCmd = JSON.parse(e.payload)
            const row: TerminalRow = {
              time: cmd.created_at,
              message: cmd.cmd,
              id: cmd.id
            }
            setRows((prev) => {
              return [...prev, row]
            })
          })
          .then((r) => {
            unListenFn.current = r
          })
      })
    }
  })

  useUnmount(() => {
    if (unListenFn.current != null) {
      console.log('cancel')
      unListenFn.current()
    }
  })

  return (
    <div>
      <Terminal
        className="h-[500px] mr-2 mt-2"
        rows={rows}
        onClear={() => {
          setRows([])
        }}
      ></Terminal>
    </div>
  )
}
export default Index
