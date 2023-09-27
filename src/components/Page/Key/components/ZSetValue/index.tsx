import React from 'react'
import { Button, Space, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import ZRem from './components/ZRem'
import { observer } from 'mobx-react-lite'
import Form from './components/Form'
import { EditOutlined } from '@ant-design/icons'
import CusTable from '@/components/CusTable'
import IconButton from '@/components/IconButton'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import Editable from '@/components/Editable'
import { useFieldScan } from '@/hooks/useFieldScan'
import useTableColumn from '@/hooks/useTableColumn'
import ValueLayout from '../ValueLayout'
import LoadMore from '@/components/LoadMore'

const Index: React.FC<{
  keys: APP.ZSetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const connection = React.useContext(context)

  const [params, setParams] = React.useState({ search: '' })

  const { t } = useTranslation()
  const { fields, more, loading, getFields, getAllFields } =
    useFieldScan<APP.Field>('key/zset/zscan', keys, params)

  const columns = useTableColumn<APP.Field>(
    [
      {
        title: (
          <div className="flex items-center justify-center">
            <div>{t('Value')}</div>
            <div
              className="w-30 ml-2"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Input.Search
                allowClear
                size="small"
                onSearch={(e) => {
                  setParams({ search: e })
                }}
              />
            </div>
          </div>
        ),
        dataIndex: 'name',
        align: 'center',
        render(_) {
          return <FieldViewer content={_} />
        }
      },
      {
        dataIndex: 'value',
        title: t('Score'),
        render(_) {
          return <FieldViewer content={_} typesArr={['datetime', 'text']} />
        },
        sorter: (a, b) => {
          if (a.value === b.value) {
            return 0
          }
          return parseFloat(a.value as string) > parseFloat(b.value as string)
            ? 1
            : -1
        }
      }
    ],
    {
      width: 200,
      fixed: 'right',
      render(_, record) {
        return (
          <Space>
            <Editable connection={connection}>
              <ZRem
                keys={keys}
                value={record.name}
                onSuccess={() => {
                  onRefresh()
                }}
              ></ZRem>
            </Editable>
            <Editable connection={connection}>
              <Form
                onSuccess={onRefresh}
                keys={keys}
                field={record}
                trigger={<IconButton icon={<EditOutlined />} />}
              ></Form>
            </Editable>
          </Space>
        )
      }
    },
    connection !== undefined && !connection.readonly
  )
  return (
    <ValueLayout
      actions={
        <Form
          onSuccess={onRefresh}
          keys={keys}
          trigger={<Button type="primary">ZAdd</Button>}
        ></Form>
      }
    >
      <CusTable
        loading={loading}
        more={more}
        onLoadMore={getFields}
        rowKey={'value'}
        dataSource={fields}
        columns={columns}
      ></CusTable>
      <div className="py-2 mb-4">
        <LoadMore
          disabled={!more}
          loading={loading}
          onGet={async () => await getFields()}
          onGetAll={getAllFields}
        />
      </div>
    </ValueLayout>
  )
}
export default observer(Index)
