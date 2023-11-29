import React from 'react'
import useRequest from '@/hooks/useRequest'

import Item from './components/Item'
import { Input, Tabs } from 'antd'
import Page from '..'
import { SearchOutlined } from '@ant-design/icons'

const Info: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const { data, fetch, loading } = useRequest<
    Record<string, Record<string, string>>
  >('server/info', connection.id)

  const [search, setSearch] = React.useState('')

  const node = React.useMemo(() => {
    if (data !== undefined) {
      const keys = Object.keys(data).sort()
      if (keys?.length === 1) {
        return (
          <Item
            data={data[keys[0]]}
            connection={connection}
            search={search}
          ></Item>
        )
      } else {
        return (
          <Tabs
            size="small"
            defaultActiveKey="0"
            tabPosition="right"
            items={keys.map((server) => {
              return {
                label: `${server}`,
                key: server,
                children: (
                  <Item
                    data={data[server]}
                    connection={connection}
                    search={search}
                  ></Item>
                )
              }
            })}
          ></Tabs>
        )
      }
    }
    return <></>
  }, [connection, data, search])
  return (
    <Page
      onRefresh={fetch}
      pageKey={pageKey}
      loading={loading}
      actionRight={
        <Input
          placeholder="Search"
          size="small"
          value={search}
          prefix={<SearchOutlined />}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
      }
    >
      {node}
    </Page>
  )
}
export default Info
