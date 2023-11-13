import React from 'react'

import { observer } from 'mobx-react-lite'
import request from '@/utils/request'

import AppLayout from '@/components/AppLayout'
import Page from '@/components/Page'
import Container from '@/components/Container'
import XTerm, { type XTermAction } from '@/components/XTerm'
import { Checkbox, Input, Space } from 'antd'
import { useEventListen } from '@/hooks/useEventListen'
import { useTranslation } from 'react-i18next'

const App: React.FC = () => {
  const searchRef = React.useRef('')

  const showResultRef = React.useRef(true)

  const term = React.useRef<XTermAction>(null)

  const { t } = useTranslation()

  useEventListen<string>(
    async () => {
      return await request('debug/log').then(() => {
        return 'debug'
      })
    },
    (e) => {
      const cmd: APP.RedisCmd = JSON.parse(e.payload)
      console.log(e.payload)
      if (
        searchRef.current === '' ||
        cmd.cmd
          .toLocaleLowerCase()
          .includes(searchRef.current.toLocaleLowerCase())
      ) {
        term.current?.writeln(`${cmd.host}> ${cmd.cmd}`)
        if (showResultRef.current) {
          term.current?.writeRedisResult(cmd.response)
        }
      }
    },
    async () => {
      return await request('debug/cancel')
    }
  )

  return (
    <AppLayout>
      <Container level={4}>
        <Page pageKey="log" wFull>
          <XTerm
            ref={term}
            onReady={(term) => {
              term.writeln('waiting for logs...')
            }}
          ></XTerm>
          <div className="mt-2 flex">
            <Space>
              <div className="w-[200px]">
                <Input
                  placeholder="filter"
                  onChange={(e) => {
                    searchRef.current = e.target.value
                  }}
                ></Input>
              </div>
              <div>
                <Space>
                  <span>{t('Show Result')}</span>
                  <Checkbox
                    defaultChecked={true}
                    onChange={(e) => {
                      showResultRef.current = e.target.checked
                    }}
                  ></Checkbox>
                </Space>
              </div>
            </Space>
          </div>
        </Page>
      </Container>
    </AppLayout>
  )
}

export default observer(App)
