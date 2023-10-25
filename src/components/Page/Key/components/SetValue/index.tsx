import React from 'react'
import { Input, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import SAdd from './components/SAdd'
import SRem from './components/SRem'
import { observer } from 'mobx-react-lite'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import { isReadonly } from '@/components/Editable'
import { useFieldScan } from '@/hooks/useFieldScan'
import useTableColumn from '@/hooks/useTableColumn'
import ValueLayout from '../ValueLayout'
import LoadMore from '@/components/LoadMore'

const SetValue: React.FC<{
  keys: APP.SetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const { t } = useTranslation()

  const connection = React.useContext(context)

  const [params, setParams] = React.useState({
    search: ''
  })

  const { fields, loading, more, getFields, getAllFields } =
    useFieldScan<string>('key/set/sscan', keys, params)

  const data = React.useMemo(() => {
    return fields.map((v, index) => {
      return {
        index: index + 1,
        value: v
      }
    })
  }, [fields])

  const columns = useTableColumn<APP.IndexValue>(
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
                  setParams({
                    search: e
                  })
                }}
              />
            </div>
          </div>
        ),
        dataIndex: 'value',
        sorter: (a, b) => {
          return a.value > b.value ? 1 : -1
        },
        render(_) {
          return <FieldViewer content={_}></FieldViewer>
        }
      }
    ],
    {
      width: '200px',
      fixed: 'right',
      render(_, record, index) {
        return (
          <Space>
            <SRem
              keys={keys}
              value={record.value}
              onSuccess={() => {
                onRefresh()
              }}
            ></SRem>
          </Space>
        )
      }
    },
    !isReadonly(connection)
  )

  return (
    <ValueLayout
      actions={
        <SAdd
          keys={keys}
          onSuccess={() => {
            onRefresh()
          }}
        ></SAdd>
      }
    >
      <CusTable
        loading={loading}
        more={more}
        onLoadMore={getFields}
        rowKey={'value'}
        dataSource={data}
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
export default observer(SetValue)
