import React from 'react'
import useRequest from '@/hooks/useRequest'

import Item from './components/Item'
import { Tabs } from 'antd'

const Index: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const { data } = useRequest<Array<Record<string, string>>>(
    'server/info',
    connection.id
  )

  if (data?.length === 1) {
    return <Item data={data[0]}></Item>
  } else {
    return (
      <Tabs
        defaultActiveKey="0"
        tabPosition="right"
        items={data?.map((v, index) => {
          return {
            label: `Server#${index}`,
            key: index.toString(),
            children: <Item data={v}></Item>
          }
        })}
      ></Tabs>
    )
  }
}
export default Index
