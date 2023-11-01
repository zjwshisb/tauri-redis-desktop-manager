import React from 'react'
import { Button, Divider, Input } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import Form, { type SubscribeForm } from './components/Form'
import Page from '..'
import { useEventListener } from '@/hooks/useEventListener'
import XTerm from '@/components/XTerm'
import { type Terminal } from 'xterm'

const Pubsub: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = (props) => {
  const [form, setForm] = React.useState<SubscribeForm>()

  const term = React.useRef<Terminal>(null)

  const { t } = useTranslation()

  const { listen, cancel } = useEventListener<string>((r) => {
    try {
      const message: APP.EventPayload<APP.PubsubMessage> = JSON.parse(r.payload)
      term.current?.writeln('1) "message"')
      term.current?.writeln(`2) "${message.data.channel}"`)
      term.current?.writeln(`3) "${message.data.payload}"`)
    } catch (e) {}
  })

  const subscribe = React.useCallback(
    async (f: SubscribeForm) => {
      await cancel()
      const res = await request<string>(
        'pubsub/subscribe',
        props.connection.id,
        f
      )
      term.current?.writeln('"OK"')
      listen(res.data)
    },
    [cancel, listen, props.connection.id]
  )

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
      <Form
        connection={props.connection}
        onChange={(v) => {
          setForm(v)
          subscribe(v)
        }}
      ></Form>
      <XTerm
        welcome="Enter channel to subscribe"
        ref={term}
        readonly
        className="h-[396px]"
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
