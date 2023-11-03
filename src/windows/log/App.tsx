import React from 'react'

import { observer } from 'mobx-react-lite'
import request from '@/utils/request'

import AppLayout from '@/components/AppLayout'
import Page from '@/components/Page'
import Container from '@/components/Container'
import { useEventListener } from '@/hooks/useEventListener'
import XTerm from '@/components/XTerm'
import { type Terminal } from 'xterm'
import { Button, Input, Space } from 'antd'
import { useTranslation } from 'react-i18next'

const App: React.FC = () => {
  const searchRef = React.useRef('')

  const term = React.useRef<Terminal>(null)

  const { t } = useTranslation()

  const [status, setStatus] = React.useState<0 | 1>(0)

  const { listen, cancel } = useEventListener<string>((e) => {
    const cmd: APP.RedisCmd = JSON.parse(e.payload)
    if (
      searchRef.current === '' ||
      cmd.cmd
        .toLocaleLowerCase()
        .includes(searchRef.current.toLocaleLowerCase())
    ) {
      term.current?.writeln(` ${cmd.host}> ${cmd.cmd}`)
      console.log('test')
    }
  })

  const handleListen = React.useCallback(() => {
    cancel()
    request('debug/log').then(() => {
      listen('debug')
      setStatus(1)
    })
  }, [cancel, listen])

  return (
    <AppLayout>
      <Container level={3}>
        <Page pageKey="log" wFull>
          <XTerm ref={term} readonly welcome="Pause button to start"></XTerm>
          <div className="mt-2 flex">
            <Space>
              {status === 0 && (
                <Button onClick={handleListen} type="primary">
                  {t('Start')}
                </Button>
              )}
              {status === 1 && (
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    cancel()
                    setStatus(0)
                  }}
                >
                  {t('Stop')}
                </Button>
              )}
              <div className="w-[200px]">
                <Input
                  placeholder="filter"
                  onChange={(e) => {
                    searchRef.current = e.target.value
                  }}
                ></Input>
              </div>
            </Space>
          </div>
        </Page>
      </Container>
    </AppLayout>
  )
}

export default observer(App)
