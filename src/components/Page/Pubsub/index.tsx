import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { Button, Divider, Input } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import Terminal from '@/components/Terminal'
import { type TerminalRow } from '@/components/Terminal/Row'
import Form, { type SubscribeForm } from './components/Form'

const Pubsub: React.FC<{
  connection: APP.Connection
}> = (props) => {
  const [eventName, setEventName] = React.useState<string>('')
  const [form, setForm] = React.useState<SubscribeForm>()

  const [rows, setRows] = React.useState<TerminalRow[]>([])

  const { t } = useTranslation()

  React.useEffect(() => {
    if (form != null) {
      request<string>('pubsub/subscribe', props.connection.id, form).then(
        (res) => {
          setEventName(res.data)
        }
      )
    }
  }, [form, props.connection.id])

  React.useEffect(() => {
    let unListen: (() => void) | undefined
    if (eventName !== '') {
      setRows([])
      appWindow
        .listen<string>(eventName, (e) => {
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
          unListen = f
        })
    }
    return () => {
      if (unListen != null) {
        unListen()
      }
    }
  }, [eventName])

  const publish = React.useMemo(() => {
    if (form != null) {
      return form.channels.map((v) => {
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
                  db: form.db
                })
              }}
            ></Input.Search>
          </div>
        )
      })
    }
  }, [form, props.connection.id, t])

  return (
    <div className="">
      <Form connection={props.connection} onChange={setForm}></Form>
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
        {publish}
      </div>
    </div>
  )
}

export default Pubsub
