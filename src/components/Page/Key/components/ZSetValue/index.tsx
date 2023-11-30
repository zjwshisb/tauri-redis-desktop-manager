import React from 'react'
import { Input } from 'antd'
import { useTranslation } from 'react-i18next'
import ZRem from './components/ZRem'
import { observer } from 'mobx-react-lite'
import ZAdd from './components/ZAdd'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import { useFieldScan } from '@/hooks/useFieldScan'
import ValueLayout from '../ValueLayout'
import LoadMore from '@/components/LoadMore'
import CusButton from '@/components/CusButton'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import BZMPop from './components/BZMPop'
import BZPopMax from './components/BZPopMax'
import BZPopMin from './components/BZPopMin'
import ZCount from './components/ZCount'
import ZDiff from './components/ZDiff'
import ZDiffStore from './components/ZDiffStore'
import ZIncrBy from './components/ZIncrBy'
import ZInter from './components/ZInter'
import ZInterCard from './components/ZInterCard'
import ZInterStore from './components/ZInterStore'
import ZLexCount from './components/ZLexCount'
import ZMPop from './components/ZMPop'
import ZMScore from './components/ZMScore'
import ZPopMax from './components/ZPopMax'
import ZPopMin from './components/ZPopMin'
import ZRandMember from './components/ZRandMember'
import ZRange from './components/ZRange'
import ZRangeStore from './components/ZRangeStore'
import ZRank from './components/ZRank'
import ZRemRangeByLex from './components/ZRemRangeByLex'
import ZRemRangeByRank from './components/ZRemRangeByRank'
import ZRemRangeByScore from './components/ZRemRangeByScore'
import ZRevRank from './components/ZRevRank'
import ZScore from './components/ZScore'
import ZUnion from './components/ZUnion'
import ZUnionStore from './components/ZUnionStore'

const Index: React.FC<{
  keys: APP.ZSetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const connection = React.useContext(context)

  const [params, setParams] = React.useState({ search: '' })

  const { t } = useTranslation()
  const { fields, more, loading, getFields, getAllFields } =
    useFieldScan<APP.Field>('zset/zscan', keys, params)

  return (
    <ValueLayout
      readonlyAction={
        <>
          <ZCount keys={keys} />
          <ZDiff keys={keys} />
          <ZInter keys={keys} />
          <ZInterCard keys={keys} />
          <ZLexCount keys={keys} />
          <ZMScore keys={keys} />
          <ZRandMember keys={keys} />
          <ZRange keys={keys} />
          <ZRank keys={keys} />
          <ZRevRank keys={keys} />
          <ZScore keys={keys} />
          <ZUnion keys={keys} />
        </>
      }
      actions={
        <>
          <ZAdd
            onSuccess={onRefresh}
            keys={keys}
            defaultValue={{
              value: [
                {
                  field: undefined,
                  value: undefined
                }
              ]
            }}
          />
          <BZMPop keys={keys} onSuccess={onRefresh} />
          <BZPopMax keys={keys} onSuccess={onRefresh} />
          <BZPopMin keys={keys} onSuccess={onRefresh} />
          <ZDiffStore keys={keys} />
          <ZIncrBy keys={keys} onSuccess={onRefresh} />
          <ZInterStore keys={keys} />
          <ZMPop keys={keys} onSuccess={onRefresh} />
          <ZPopMax keys={keys} onSuccess={onRefresh} />
          <ZPopMin keys={keys} onSuccess={onRefresh} />
          <ZRangeStore keys={keys} />
          <ZRem
            keys={keys}
            onSuccess={onRefresh}
            defaultValue={{
              value: [undefined]
            }}
          ></ZRem>
          <ZRemRangeByLex keys={keys} onSuccess={onRefresh} />
          <ZRemRangeByRank keys={keys} onSuccess={onRefresh} />
          <ZRemRangeByScore keys={keys} onSuccess={onRefresh} />
          <ZUnionStore keys={keys} />
        </>
      }
    >
      <CusTable
        action={{
          width: 200,
          render(_, record) {
            return (
              <div>
                <ZAdd
                  keys={keys}
                  onSuccess={onRefresh}
                  trigger={<CusButton type="link" icon={<EditOutlined />} />}
                  defaultValue={{
                    value: [
                      {
                        field: record.field,
                        value: record.value
                      }
                    ]
                  }}
                ></ZAdd>
                <ZRem
                  trigger={<CusButton type="link" icon={<DeleteOutlined />} />}
                  keys={keys}
                  defaultValue={{
                    value: [record.field]
                  }}
                  onSuccess={onRefresh}
                ></ZRem>
                <ZIncrBy
                  keys={keys}
                  onSuccess={onRefresh}
                  defaultValue={{
                    field: record.field
                  }}
                  trigger={<CusButton icon={<PlusOutlined />} type="link" />}
                />
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
                <div>{t('Member')}</div>
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
