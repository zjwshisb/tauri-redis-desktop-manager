import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import request from '@/utils/request'
import Terminal from '@/components/Terminal'
import { type TerminalRow } from '@/components/Terminal/Row'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import useArrayState from '@/hooks/useArrayState'
import { useLatest } from 'ahooks'
import SearchText from '@/components/SearchText'
import Page from '..'

const Monitor: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = (props) => {
  const [search, setSearch] = React.useState('')

  const searchRef = useLatest(search)

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
    if (eventName !== '' && !stop) {
      appWindow
        .listen<string>(eventName, (r) => {
          try {
            const message: APP.EventPayload<string> = JSON.parse(r.payload)
            if (
              searchRef.current === '' ||
              message.data
                .toLocaleLowerCase()
                .includes(searchRef.current.toLocaleLowerCase())
            ) {
              append({
                id: message.id,
                message: (
                  <SearchText
                    text={message.data}
                    search={searchRef.current}
                  ></SearchText>
                )
              })
            }
          } catch (e) {}
        })
        .then((f) => {
          unListen = f
        })
    }
    return () => {
      if (eventName !== '') {
        request('pubsub/cancel', 0, {
          name: eventName
        })
      }
      if (unListen !== undefined) {
        unListen()
      }
    }
  }, [append, eventName, stop, searchRef])

  return (
    <Page pageKey={props.pageKey}>
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
        search={search}
        onSearchChange={setSearch}
        className="h-[500px] w-full"
        rows={items}
        onClear={clear}
      ></Terminal>
    </Page>
  )
}

export default Monitor
