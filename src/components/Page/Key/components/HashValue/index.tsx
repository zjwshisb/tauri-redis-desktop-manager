import React, { useContext, useState } from 'react'
import { Input } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import HSet from './components/HSet'
import HDel from './components/HDel'
import { useTranslation } from 'react-i18next'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import { useFieldScan } from '@/hooks/useFieldScan'
import ValueLayout from '../ValueLayout'
import LoadMore from '@/components/LoadMore'
import Highlighter from 'react-highlight-words'
import CusButton from '@/components/CusButton'
import HExists from './components/HExists'
import HGet from './components/HGet'
import HGetAll from './components/HGetAll'
import HIncrBy from './components/IncrBy'
import HIncrByFloat from './components/IncrByFloat'
import HKeys from './components/HKeys'
import HLen from './components/HLen'
import HMGet from './components/HMGet'
import HRandField from './components/HRandField'
import HSetNx from './components/HSetNx'
import HStrLen from './components/HStrLen'
import HVals from './components/HVals'

const HashValue: React.FC<{
  keys: APP.HashKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const connection = useContext(context)
  const [params, setParams] = useState({
    search: ''
  })
  const { t } = useTranslation()

  const { fields, getFields, loading, more, getAllFields } =
    useFieldScan<APP.Field>('hash/hscan', keys, params)

  return (
    <ValueLayout
      readonlyAction={
        <>
          <HExists keys={keys} />
          <HGet keys={keys} />
          <HGetAll keys={keys} />
          <HKeys keys={keys} />
          <HLen keys={keys} />
          <HMGet keys={keys} />
          <HRandField keys={keys} />
          <HStrLen keys={keys} />
          <HVals keys={keys} />
        </>
      }
      actions={
        <>
          <HDel keys={keys} onSuccess={onRefresh} />
          <HIncrBy keys={keys} onSuccess={onRefresh} />
          <HIncrByFloat keys={keys} onSuccess={onRefresh} />
          <HSet
            keys={keys}
            onSuccess={onRefresh}
            defaultValue={{
              value: [undefined]
            }}
          />
          <HSetNx keys={keys} onSuccess={onRefresh} />
        </>
      }
    >
      <CusTable
        loading={loading}
        rowKey={'field'}
        more={more}
        addIndex
        readonly={connection?.readonly}
        onLoadMore={getFields}
        dataSource={fields}
        action={{
          width: 200,
          render(_, record) {
            return (
              <div>
                <HIncrBy
                  keys={keys}
                  onSuccess={onRefresh}
                  defaultValue={{
                    field: record.field
                  }}
                  trigger={
                    <CusButton type="link" icon={<PlusOutlined />}></CusButton>
                  }
                />
                <HSet
                  trigger={
                    <CusButton icon={<EditOutlined />} type="link"></CusButton>
                  }
                  keys={keys}
                  defaultValue={{
                    value: [
                      {
                        ...record
                      }
                    ]
                  }}
                  onSuccess={onRefresh}
                />
                <HDel
                  keys={keys}
                  trigger={<CusButton type="link" icon={<DeleteOutlined />} />}
                  defaultValue={{
                    value: [record.field]
                  }}
                  onSuccess={onRefresh}
                />
              </div>
            )
          }
        }}
        columns={[
          {
            dataIndex: 'field',
            width: 300,
            title: (
              <div className="flex items-center justify-center">
                <div>{t('Field')}</div>
                <div
                  className="ml-2"
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
            render(value) {
              return (
                <Highlighter
                  textToHighlight={value}
                  searchWords={[params.search]}
                />
              )
            }
          },
          {
            dataIndex: 'value',
            title: 'Value',
            render(_) {
              return <FieldViewer content={_}></FieldViewer>
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
export default HashValue
