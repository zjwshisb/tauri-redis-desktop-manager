import { type ColumnsType } from 'antd/es/table'
import React from 'react'
import Page from '..'
import useRequest from '@/hooks/useRequest'
import CusTable from '@/components/CusTable'

const Node: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const { data, fetch, loading } = useRequest<APP.Node[]>(
    'cluster/nodes',
    connection.id
  )

  const columns: ColumnsType<APP.Node> = React.useMemo(() => {
    const fields = [
      'id',
      'config_epoch',
      'flags',
      'host',
      'link_state',
      'master',
      'ping_sent',
      'pong_recv',
      'slot'
    ]
    return fields.map((v) => {
      return {
        dataIndex: v,
        title: v,
        align: 'center'
      }
    })
  }, [])

  return (
    <Page pageKey={pageKey} onRefresh={fetch} loading={loading}>
      <CusTable
        virtual={false}
        dataSource={data?.sort((a, b) =>
          a.config_epoch > b.config_epoch ? 1 : -1
        )}
        rowKey={'id'}
        columns={columns}
      ></CusTable>
    </Page>
  )
}
export default Node
