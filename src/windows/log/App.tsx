import React from 'react'

import { observer } from 'mobx-react-lite'
import request from '@/utils/request'

import AppLayout from '@/components/AppLayout'
import Page from '@/components/Page'
import Container from '@/components/Container'
import { useEventListener } from '@/hooks/useEventListener'
import XTerm from '@/components/XTerm'
import { type Terminal } from 'xterm'
import { Button } from 'antd'

const App: React.FC = () => {
  const searchRef = React.useRef('')

  const term = React.useRef<Terminal>(null)

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
    })
  }, [cancel, listen])

  return (
    <AppLayout>
      <Container level={3}>
        <Page pageKey="log" wFull>
          <XTerm ref={term} readonly welcome="Pause button to start"></XTerm>
          <Button onClick={handleListen}>Start</Button>
        </Page>
      </Container>
    </AppLayout>
  )
}

export default observer(App)
