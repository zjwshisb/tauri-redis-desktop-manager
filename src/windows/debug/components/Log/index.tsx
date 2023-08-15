import React from 'react'
import request from '@/utils/request'
import { event } from '@tauri-apps/api'
import Terminal, { type TerminalRow } from '@/components/Terminal'
import { useMount, useUnmount } from 'ahooks'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

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
              tags: [cmd.host, `${cmd.duration}us`],
              message: cmd.cmd,
              id: cmd.id,
              messageNode: (
                <div className="flex">
                  <div>{cmd.cmd}</div>
                  <Tooltip
                    title={cmd.response}
                    className="ml-1"
                    placement="right"
                  >
                    <InfoCircleOutlined className="text-amber-600" />
                  </Tooltip>
                </div>
              )
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
    <div className="mr-6 pt-2">
      <Terminal
        className="h-[500px]"
        rows={rows}
        onClear={() => {
          setRows([])
        }}
      ></Terminal>
    </div>
  )
}
export default Index
