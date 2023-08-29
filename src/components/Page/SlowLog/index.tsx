import useRequest from '@/hooks/useRequest'
import React from 'react'
import dayjs from 'dayjs'
import Page from '..'
import CusTable from '@/components/CusTable'
import useTableColumn from '@/hooks/useTableColumn'

const SlowLog: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const { data, loading, fetch } = useRequest<{
    logs: APP.SlowLog[]
    time: number
    count: number
  }>('server/slow-log', connection.id)

  const columns = useTableColumn<APP.SlowLog>([
    {
      dataIndex: 'id',
      title: 'id'
    },
    {
      dataIndex: 'processed_at',
      title: 'processed_at',
      render(v) {
        return dayjs.unix(v).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
      }
    },
    {
      dataIndex: 'time',
      title: 'amount time(us)',
      defaultSortOrder: 'descend',
      sorter(a, b) {
        return a.time > b.time ? 1 : -1
      }
    },
    {
      dataIndex: 'cmd',
      title: 'cmd'
    },
    {
      dataIndex: 'client_ip',
      title: 'client_ip'
    },
    {
      dataIndex: 'client_name',
      title: 'client_name'
    }
  ])

  return (
    <Page pageKey={pageKey} onRefresh={fetch} loading={loading}>
      <div className="mb-2">
        <div>slowlog-log-slower-than: {data?.time}us</div>
        <div>slowlog-max-len: {data?.count}</div>
      </div>
      <CusTable
        rowKey={'uid'}
        dataSource={data?.logs}
        columns={columns}
      ></CusTable>
    </Page>
  )
}
export default SlowLog
