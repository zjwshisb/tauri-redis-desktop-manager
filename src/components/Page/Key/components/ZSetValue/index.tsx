import React from 'react'
import { Input } from 'antd'
import { useTranslation } from 'react-i18next'
import ZRem from './components/ZRem'
import { observer } from 'mobx-react-lite'
import FieldForm from './components/FieldForm'
import { EditOutlined } from '@ant-design/icons'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import { useFieldScan } from '@/hooks/useFieldScan'
import ValueLayout from '../ValueLayout'
import LoadMore from '@/components/LoadMore'
import CusButton from '@/components/CusButton'

const Index: React.FC<{
  keys: APP.ZSetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const connection = React.useContext(context)

  const [params, setParams] = React.useState({ search: '' })

  const { t } = useTranslation()
  const { fields, more, loading, getFields, getAllFields } =
    useFieldScan<APP.Field>('key/zset/zscan', keys, params)

  return (
    <ValueLayout
      actions={
        <FieldForm
          onSuccess={onRefresh}
          keys={keys}
          trigger={<CusButton>ZADD</CusButton>}
        ></FieldForm>
      }
    >
      <CusTable
        action={{
          width: 200,
          render(_, record) {
            return (
              <div>
                <ZRem
                  keys={keys}
                  value={record.field}
                  onSuccess={() => {
                    onRefresh()
                  }}
                ></ZRem>
                <FieldForm
                  onSuccess={onRefresh}
                  keys={keys}
                  field={record}
                  trigger={<CusButton icon={<EditOutlined />} type="link" />}
                ></FieldForm>
              </div>
            )
          }
        }}
        loading={loading}
        more={more}
        onLoadMore={getFields}
        rowKey={'value'}
        dataSource={fields}
        readonly={connection?.readonly}
        columns={[
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
            dataIndex: 'field',
            render(_) {
              return <FieldViewer content={_} />
            }
          },
          {
            dataIndex: 'value',
            title: 'Score',
            render(_) {
              return <FieldViewer content={_} typesArr={['datetime', 'text']} />
            },
            sorter: (a, b) => {
              if (a.value === b.value) {
                return 0
              }
              return parseFloat(a.value) > parseFloat(b.value) ? 1 : -1
            }
          }
        ]}
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
