import React from 'react'
import request from '@/utils/request'
import { event } from '@tauri-apps/api'
import Terminal, { type TerminalRow } from '@/components/Terminal'
import { useLatest, useMount, useUnmount } from 'ahooks'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import useArrayState from '@/hooks/useArrayState'
import SearchText from '@/components/SearchText'

const Index: React.FC = () => {
  const { items, append, clear } = useArrayState<TerminalRow>(100)

  const unListenFn = React.useRef<() => void>()

  const [search, setSearch] = React.useState('')

  const searchRef = useLatest(search)

  const init = React.useRef(false)

  useMount(() => {
    if (!init.current) {
      init.current = true
      request('debug/log').then(() => {
        event
          .listen<string>('debug', (e) => {
            const cmd: APP.RedisCmd = JSON.parse(e.payload)
            if (
              searchRef.current === '' ||
              cmd.cmd
                .toLocaleLowerCase()
                .includes(searchRef.current.toLocaleLowerCase())
            ) {
              const row: TerminalRow = {
                time: cmd.created_at,
                tags: [cmd.host, `${cmd.duration}us`],
                message: (
                  <div className="flex">
                    <div>
                      <SearchText text={cmd.cmd} search={searchRef.current} />
                    </div>
                    <Tooltip
                      title={cmd.response}
                      className="ml-1"
                      placement="right"
                    >
                      <InfoCircleOutlined className="text-amber-600" />
                    </Tooltip>
                  </div>
                ),
                id: cmd.id
              }
              append(row)
            }
          })
          .then((r) => {
            unListenFn.current = r
          })
      })
    }
  })

  useUnmount(() => {
    if (unListenFn.current != null) {
      unListenFn.current()
    }
  })

  return (
    <div className="mr-6 pt-2">
      <Terminal
        className="h-[500px]"
        rows={items}
        onClear={clear}
        search={search}
        onSearchChange={setSearch}
      ></Terminal>
    </div>
  )
}
export default Index
