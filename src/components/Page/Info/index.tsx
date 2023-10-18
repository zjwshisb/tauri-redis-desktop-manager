import React from 'react'
import useRequest from '@/hooks/useRequest'

import Item from './components/Item'
import { Tabs } from 'antd'
import Page from '..'

const Info: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const { data, fetch, loading } = useRequest<
    Record<string, Record<string, string>>
  >('server/info', connection.id)

  const node = React.useMemo(() => {
    if (data !== undefined) {
      const keys = Object.keys(data).sort()
      if (keys?.length === 1) {
        return <Item data={data[keys[0]]} connection={connection}></Item>
      } else {
        return (
          <Tabs
            defaultActiveKey="0"
            tabPosition="right"
            items={keys.map((server) => {
              return {
                label: `${server}`,
                key: server,
                children: (
                  <Item data={data[server]} connection={connection}></Item>
                )
              }
            })}
          ></Tabs>
        )
      }
    }
    return <></>
  }, [connection, data])
  return (
    <Page onRefresh={fetch} pageKey={pageKey} loading={loading}>
      {node}
    </Page>
  )
}
export default Info
