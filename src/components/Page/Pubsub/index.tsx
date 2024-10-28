import React from 'react'
import { Button, Divider, Input } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import Form, { type SubscribeForm } from './components/Form'
import Page from '..'
import XTerm, { type XTermAction } from '@/components/XTerm'
import { useEventListen } from '@/hooks/useEventListen'
import { getCurrentWindow } from '@tauri-apps/api/window'

const Pubsub: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = (props) => {
  const [form, setForm] = React.useState<SubscribeForm>()

  const term = React.useRef<XTermAction>(null)

  const { t } = useTranslation()

  const { listen, clear } = useEventListen<string>(
    async () => {
      const res = await request<string>(
        'pubsub/subscribe',
        props.connection.id,
        form
      )
      return res.data
    },
    (r) => {
      try {
        const message: APP.EventPayload<APP.PubsubMessage> = JSON.parse(
          r.payload
        )
        term.current?.writeln('1) "message"')
        term.current?.writeln(`2) "${message.data.channel}"`)
        term.current?.writeln(`3) "${message.data.payload}"`)
      } catch (e) {}
    },
    getCurrentWindow(),
    async (name) => {
      return await request('pubsub/cancel', 0, {
        name
      })
    },
    false
  )

  React.useEffect(() => {
    if (form != null) {
      listen().then()
      return () => {
        clear().then()
      }
    }
  }, [clear, form, listen])

  const publish = React.useMemo(() => {
    if (form != null) {
      return form.channels.map((v) => {
        return (
          <div key={v} className="py-1 w-[400px]">
            <Input.Search
              placeholder="payload"
              enterButton={
                <Button size="small" type="primary">
                  {t('Publish')}
                </Button>
              }
              addonBefore={v}
              onSearch={(e) => {
                if (e.length > 0) {
                  request('pubsub/publish', props.connection.id, {
                    channel: v,
                    value: e,
                    db: form.db
                  })
                }
              }}
            ></Input.Search>
          </div>
        )
      })
    }
  }, [form, props.connection.id, t])

  return (
    <Page pageKey={props.pageKey}>
      <Form
        connection={props.connection}
        onChange={(v) => {
          setForm(v)
        }}
      ></Form>
      <XTerm
        ref={term}
        onReady={(term) => {
          term.writeln('Enter channels to subscribe...')
        }}
      />

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
