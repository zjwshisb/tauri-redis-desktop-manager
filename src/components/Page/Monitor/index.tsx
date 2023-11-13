import React from 'react'
import request from '@/utils/request'
import { Input, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import Page from '..'
import XTerm, { type XTermAction } from '@/components/XTerm'

import { useEventListen } from '@/hooks/useEventListen'

const Monitor: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = (props) => {
  const search = React.useRef('')

  const { t } = useTranslation()

  const term = React.useRef<XTermAction>(null)

  useEventListen<string>(
    async () => {
      return (await request<string>('pubsub/monitor', props.connection.id)).data
    },
    (r) => {
      try {
        const message: APP.EventPayload<string> = JSON.parse(r.payload)
        if (search.current !== '') {
          if (
            message.data
              .toLocaleLowerCase()
              .includes(search.current.toLocaleLowerCase())
          ) {
            term.current?.writeln(message.data)
          }
        } else {
          term.current?.writeln(message.data)
        }
      } catch (e) {}
    },
    async (name) => {
      return await request('pubsub/cancel', 0, {
        name
      })
    }
  )

  return (
    <Page pageKey={props.pageKey}>
      <XTerm
        ref={term}
        onReady={(term) => {
          term.writeln('waiting for logs...')
        }}
      />
      <div className="mt-2">
        <Space>
          <Input
            className="!w-[200px]"
            placeholder={t('Filter').toString()}
            onChange={(e) => {
              search.current = e.target.value
            }}
          />
        </Space>
      </div>
    </Page>
  )
}

export default Monitor
