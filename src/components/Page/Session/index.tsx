import useCancelIntercal from '@/hooks/useCaclelInterval'
import useRequest from '@/hooks/useRequest'
import { type ColumnsType } from 'antd/es/table'
import React from 'react'
import Page from '..'
import CusTable from '@/components/CusTable'

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
      <CusTable
        virtual={false}
        dataSource={data}
        rowKey={'id'}
        bordered
        columns={columns}
      ></CusTable>
    </Page>
  )
}
export default Session
