import useCancelIntercal from '@/hooks/useCaclelInterval'
import useRequest from '@/hooks/useRequest'
import { Table } from 'antd'
import { type ColumnsType } from 'antd/es/table'
import React from 'react'
import Page from '..'

interface Client {
  id: string
  types: string
  created_at: string
  host: string
  proxy: string
}

const Session: React.FC = () => {
  const { data, fetch } = useRequest<Client[]>('debug/clients')

  useCancelIntercal(fetch, 2000)

  const columns: ColumnsType<Client> = React.useMemo(() => {
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
    <Page pageKey="session">
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
  )
}
export default Session
