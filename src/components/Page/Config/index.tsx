import Editable from '@/components/Editable'
import useRequest from '@/hooks/useRequest'
import { EditOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
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
  const { data, loading, fetch } = useRequest<APP.Field[]>(
    'config/all',
    connection.id
  )

  const [search, setSearch] = React.useState('')

  const { t } = useTranslation()

  const item = React.useMemo(() => {
    if (data != null) {
      return data.filter((v) => {
        return v.field.includes(search.toLowerCase())
      })
    }
    return []
  }, [data, search])

  const columns = useTableColumn<APP.Field>(
    [
      {
        title: t('Name'),
        dataIndex: 'field',
        width: 300,
        defaultSortOrder: 'ascend',
        sorter(a, b) {
          return a.field > b.field ? 1 : -1
        }
      },
      {
        title: t('Value'),
        dataIndex: 'value'
      }
    ],
    {
      width: 200,
      render(record) {
        return (
          <Editable connection={connection}>
            <Edit
              connection={connection}
              onSuccess={fetch}
              field={record}
              trigger={<Button icon={<EditOutlined />} type="link"></Button>}
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
      <CusTable
        rowKey={'field'}
        dataSource={item}
        columns={columns}
        virtual={false}
      ></CusTable>
    </Page>
  )
}
export default Config
