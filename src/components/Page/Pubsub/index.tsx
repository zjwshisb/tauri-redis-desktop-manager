import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { Button, Divider, Input } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import Terminal from '@/components/Terminal'
import { type TerminalRow } from '@/components/Terminal/Row'
import Form, { type SubscribeForm } from './components/Form'
import useArrayState from '@/hooks/useArrayState'
import Page from '..'

const Pubsub: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = (props) => {
  const [eventName, setEventName] = React.useState<string>('')
  const [form, setForm] = React.useState<SubscribeForm>()

  const { items, append, clear } = useArrayState<TerminalRow>(100)

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
      clear()
      appWindow
        .listen<string>(eventName, (e) => {
          try {
            const message: APP.EventPayload<APP.PubsubMessage> = JSON.parse(
              e.payload
            )
            append({
              id: message.id,
              tags: [message.data.channel],
              message: message.data.payload,
              time: message.time
            })
          } catch (e) {}
        })
        .then((f) => {
          unListen = f
        })
      return () => {
        request('pubsub/cancel', 0, {
          name: eventName
        })
        if (unListen != null) {
          unListen()
        }
      }
    }
    return () => {}
  }, [append, clear, eventName])

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
    <Page pageKey={props.pageKey}>
      <Form connection={props.connection} onChange={setForm}></Form>
      <Terminal className="h-[500px]" rows={items} onClear={clear}></Terminal>
      <div className="py-2">
        <Divider orientation="left" plain>
          {t('Channel')}
        </Divider>
        {publish}
      </div>
    </Page>
  )
}

export default Pubsub
