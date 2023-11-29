import React from 'react'

import { observer } from 'mobx-react-lite'

import useStore from '@/hooks/useStore'
import useSearchParam from '@/hooks/useSearchParam'
import { MacScrollbar } from 'mac-scrollbar'

import { type Page } from '@/store/page'
import AppLayout from '@/components/AppLayout'
import Container from '@/components/Container'
import DetailPage from '@/components/Page/DetailPage'
import { getCurrent } from '@tauri-apps/api/window'
import { FloatButton, Result } from 'antd'

const App: React.FC = () => {
  const store = useStore()

  const params = useSearchParam<{
    name: string
    cid: string
    db: string
    key: string
    type: Page['type']
    file: string
    channels: string
  }>()

  const connection = React.useMemo(() => {
    if (params.cid !== undefined) {
      return store.connection.connections.find((v) => {
        return v.id === parseInt(params.cid as string)
      })
    }
    return undefined
  }, [params.cid, store.connection.connections])

  React.useEffect(() => {
    if (connection?.id !== undefined) {
      store.connection.open(connection.id)
    }
  }, [connection?.id, store.connection])

  const ref = React.useRef<HTMLElement>(null)

  if (params.key === undefined || params.type === undefined) {
    return <Result title="Page Not Found"></Result>
  }

  store.page.addExistsPage({
    pageKey: decodeURI(params.key),
    type: params.type,
    name: params.name !== undefined ? params.name : params.type,
    db: params.db !== undefined ? parseInt(params.db) : undefined,
    label: getCurrent().label,
    connection
  })

  return (
    <AppLayout>
      <Container className="flex-1 w-full flex" level={4}>
        <MacScrollbar
          className="w-full overflow-scroll"
          id="container"
          ref={ref}
        >
          <DetailPage
            connection={connection}
            pageKey={decodeURI(params.key)}
            type={params.type}
            name={params.name}
            db={params.db !== undefined ? parseInt(params.db) : undefined}
          ></DetailPage>
        </MacScrollbar>
        <FloatButton.BackTop
          target={() => {
            return ref.current as HTMLElement
          }}
        ></FloatButton.BackTop>
      </Container>
    </AppLayout>
  )
}

export default observer(App)
