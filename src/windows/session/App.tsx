import React from 'react'

import { observer } from 'mobx-react-lite'

import 'mac-scrollbar/dist/mac-scrollbar.css'
import useCancelIntercal from '@/hooks/useCaclelInterval'
import useRequest from '@/hooks/useRequest'
import { type ColumnsType } from 'antd/es/table'
import AppLayout from '@/components/AppLayout'
import { Table } from 'antd'
import Page from '@/components/Page'

interface Session {
  id: string
  types: string
  created_at: string
  host: string
  proxy: string
}

const App: React.FC = () => {
  const { data, fetch } = useRequest<Session[]>('debug/clients')

  useCancelIntercal(fetch, 2000)

  const columns: ColumnsType<Session> = React.useMemo(() => {
    const fields = ['id', 'host', 'types', 'created_at', 'proxy']
    return fields.map((v) => {
      return {
        dataIndex: v,
        title: v,
        align: 'center'
      }
    })
  }, [])
  return (
    <AppLayout>
      <Page pageKey="session" wFull>
        <Table
          dataSource={data}
          size="small"
          rowKey={'id'}
          scroll={{
            x: 'auto'
          }}
          bordered
          columns={columns}
          pagination={false}
        ></Table>
      </Page>
    </AppLayout>
  )
}

export default observer(App)
