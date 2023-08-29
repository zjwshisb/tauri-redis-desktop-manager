import Editable from '@/components/Editable'
import IconButton from '@/components/IconButton'
import useRequest from '@/hooks/useRequest'
import { EditOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Edit from './Components/Edit'

import Rewrite from './Components/Rewrite'
import ResetStat from './Components/ResetStat'
import Page from '..'
import CusTable from '@/components/CusTable'
import useTableColumn from '@/hooks/useTableColumn'

const Config: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const { data, loading, fetch } = useRequest<Record<string, string>>(
    'config/all',
    connection.id
  )

  const [search, setSearch] = React.useState('')

  const { t } = useTranslation()

  const item = React.useMemo(() => {
    if (data != null) {
      return Object.keys(data)
        .filter((v) => {
          if (search !== '') {
            return v.includes(search)
          }
          return true
        })
        .map((v) => {
          return {
            name: v,
            value: data[v]
          }
        })
    }
    return []
  }, [data, search])

  const columns = useTableColumn<APP.NameValue>(
    [
      {
        title: t('Name'),
        dataIndex: 'name',
        width: 300,
        defaultSortOrder: 'ascend',
        sorter(a, b) {
          return a.name > b.name ? 1 : -1
        }
      },
      {
        title: t('Value'),
        dataIndex: 'value'
      }
    ],
    {
      render(record) {
        return (
          <Editable connection={connection}>
            <Edit
              connection={connection}
              onSuccess={fetch}
              field={record}
              trigger={<IconButton icon={<EditOutlined />}></IconButton>}
            ></Edit>
          </Editable>
        )
      }
    },
    !connection.readonly,
    false
  )

  return (
    <Page pageKey={pageKey} onRefresh={fetch} loading={loading}>
      <div className="flex mb-2">
        <div className="w-[300px]">
          <Input
            placeholder={t('Filter').toString()}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
          ></Input>
        </div>
        <Rewrite connection={connection}></Rewrite>
        <ResetStat connection={connection}></ResetStat>
      </div>
      <CusTable rowKey={'name'} dataSource={item} columns={columns}></CusTable>
    </Page>
  )
}
export default Config
