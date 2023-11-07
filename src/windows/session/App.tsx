import React from 'react'

import { observer } from 'mobx-react-lite'

import useCancelIntercal from '@/hooks/useCaclelInterval'
import useRequest from '@/hooks/useRequest'
import { type ColumnsType } from 'antd/es/table'
import AppLayout from '@/components/AppLayout'
import { Table } from 'antd'
import Page from '@/components/Page'
import Container from '@/components/Container'

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
      <Container level={4}>
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
      </Container>
    </AppLayout>
  )
}

export default observer(App)
