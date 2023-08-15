import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { Button, Divider, Input } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import Terminal from '@/components/Terminal'
import { type TerminalRow } from '@/components/Terminal/Row'

const Pubsub: React.FC<{
  channels: string[]
  connection: APP.Connection
  db: number
}> = (props) => {
  const unListen = React.useRef<() => void>()
  const [name, setName] = React.useState('')

  const [rows, setRows] = React.useState<TerminalRow[]>([])

  const { t } = useTranslation()

  const initialized = React.useRef(false)

  React.useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      request<string>('pubsub/subscribe', props.connection.id, {
        db: props.db,
        channels: props.channels
      }).then((res) => {
        setName(res.data)
      })
    }
  }, [props.channels, props.connection.id, props.db])

  React.useEffect(() => {
    return () => {
      if (name !== '') {
        console.log('cancel:', name)
        request('pubsub/cancel', 0, {
          name
        })
      }
    }
  }, [name])

  React.useEffect(() => {
    if (name !== '') {
      console.log('listen:', name)
      appWindow
        .listen<string>(name, (e) => {
          try {
            const message: APP.EventPayload<APP.PubsubMessage> = JSON.parse(
              e.payload
            )
            setRows((prev) => {
              return [...prev].concat([
                {
                  id: message.id,
                  tags: [message.data.channel],
                  message: message.data.payload,
                  time: message.time
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
  }, [unListen])

  return (
    <div className="">
      <Terminal
        className="h-[500px]"
        rows={rows}
        onClear={() => {
          setRows([])
        }}
      ></Terminal>
      <div className="py-2">
        <Divider orientation="left" plain>
          {t('Channel')}
        </Divider>
        {props.channels.map((v) => {
          return (
            <div key={v} className="py-1 w-[400px]">
              <Input.Search
                placeholder="payload"
                enterButton={<Button>{t('Publish')}</Button>}
                addonBefore={v}
                onSearch={(e) => {
                  request('pubsub/publish', props.connection.id, {
                    channel: v,
                    value: e,
                    db: props.db
                  })
                }}
              ></Input.Search>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Pubsub
