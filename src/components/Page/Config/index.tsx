import Editable from '@/components/Editable'
import useRequest from '@/hooks/useRequest'
import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import { Input, Space } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Edit from './Components/Edit'

import Rewrite from './Components/Rewrite'
import ResetStat from './Components/ResetStat'
import Page from '..'
import CusTable from '@/components/CusTable'
import Highlighter from 'react-highlight-words'
import CusButton from '@/components/CusButton'

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

  return (
    <Page pageKey={pageKey} onRefresh={fetch} loading={loading}>
      <div className="flex mb-2">
        <Space>
          <div className="w-[300px]">
            <Input
              prefix={<SearchOutlined />}
              placeholder={t('Filter').toString()}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            ></Input>
          </div>
          <Rewrite connection={connection} onSuccess={fetch}></Rewrite>
          <ResetStat connection={connection} onSuccess={fetch}></ResetStat>
        </Space>
      </div>
      <CusTable
        action={{
          width: 100,
          render(record) {
            return (
              <Editable connection={connection}>
                <Edit
                  connection={connection}
                  onSuccess={fetch}
                  field={record}
                  trigger={
                    <CusButton icon={<EditOutlined />} type="link"></CusButton>
                  }
                ></Edit>
              </Editable>
            )
          }
        }}
        readonly={connection.readonly}
        rowKey={'field'}
        dataSource={item}
        columns={[
          {
            title: 'Name',
            dataIndex: 'field',
            defaultSortOrder: 'ascend',
            render(value) {
              return (
                <Highlighter searchWords={[search]} textToHighlight={value} />
              )
            },
            sorter(a, b) {
              return a.field > b.field ? 1 : -1
            }
          },
          {
            title: 'Value',
            dataIndex: 'value'
          }
        ]}
        virtual={false}
      ></CusTable>
    </Page>
  )
}
export default Config
