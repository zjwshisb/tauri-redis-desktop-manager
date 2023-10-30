import React, { useCallback } from 'react'
import request from '@/utils/request'
import { Button, Input, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import Page from '..'
import XTerm from '@/components/XTerm'
import { type Terminal } from 'xterm'

import { useEventListener } from '@/hooks/useEventListener'

const Monitor: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = (props) => {
  const [status, setStatus] = React.useState<0 | 1>(0)

  const search = React.useRef('')

  const { t } = useTranslation()

  const term = React.useRef<Terminal>(null)

  const { listen, cancel } = useEventListener((r) => {
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
  })

  const listenFn = useCallback(
    async (cid: number) => {
      const res = await request<string>('pubsub/monitor', cid)
      await listen(res.data).then((r) => {
        setStatus(1)
      })
    },
    [listen]
  )

  return (
    <Page pageKey={props.pageKey}>
      <XTerm
        readonly={true}
        ref={term}
        className="h-[500px] w-full overflow-hidden rounded"
        welcome="click start button to start monitor"
      />
      <div className="mt-2">
        <Space>
          {status === 0 && (
            <Button
              type="primary"
              onClick={async () => {
                listenFn(props.connection.id)
              }}
            >
              {t('Start')}
            </Button>
          )}
          {status === 1 && (
            <Button
              type="primary"
              danger
              onClick={() => {
                cancel().then(() => {
                  setStatus(0)
                })
              }}
            >
              {t('Stop')}
            </Button>
          )}
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
