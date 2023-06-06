import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { Button, Divider, Input } from 'antd'
import Item from './Item'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  channels: string[]
  eventName: string
  connection: APP.Connection
  db: number
}> = (props) => {
  const unListen = React.useRef<(() => void) | null>(null)

  const [messages, setMessages] = React.useState<
    Array<APP.EventPayload<APP.PubsubMessage>>
  >([])

  const { t } = useTranslation()

  React.useEffect(() => {
    appWindow
      .listen<string>(props.eventName, (e) => {
        try {
          const message: APP.EventPayload<APP.PubsubMessage> = JSON.parse(
            e.payload
          )
          setMessages((prev) => {
            return [...prev].concat([message])
          })
        } catch (e) {}
        console.log(e.payload)
      })
      .then((f) => {
        unListen.current = f
      })
    return () => {
      if (unListen.current != null) {
        unListen.current()
      }
    }
  }, [props.eventName])

  const container = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    if (container.current != null) {
      container.current.scrollTop = container.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="">
      <div
        className="h-[500px] bg-[#002B36] overflow-y-auto p-2"
        ref={container}
      >
        {messages.map((v, index) => {
          return <Item message={v} key={v.id + index}></Item>
        })}
      </div>
      <div className="py-2">
        <Button
          onClick={() => {
            setMessages([])
          }}
        >
          {t('Clear')}
        </Button>
      </div>
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

export default Index
