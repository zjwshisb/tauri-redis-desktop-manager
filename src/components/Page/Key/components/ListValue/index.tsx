import React from 'react'
import request from '@/utils/request'
import { Space } from 'antd'
import { useTranslation } from 'react-i18next'
import LTrim from './components/LTrim'
import LSet from './components/LSet'
import LInsert from './components/LInsert'
import LPush from './components/LPush'
import LPop from './components/LPop'
import RPush from './components/RPush'
import RPop from './components/RPop'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import Editable from '@/components/Editable'
import useTableColumn from '@/hooks/useTableColumn'
import ValueLayout from '../ValueLayout'
import LoadMore from '@/components/LoadMore'

const Index: React.FC<{
  keys: APP.ListKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const store = useStore()

  const [items, setItems] = React.useState<string[]>([])

  const [loading, setLoading] = React.useState(false)

  const [more, setMore] = React.useState(true)

  const { t } = useTranslation()

  const index = React.useRef(0)

  const connection = React.useContext(context)

  const getFields = React.useCallback(
    async (reset = false) => {
      const start = index.current
      const stop = index.current + store.setting.setting.field_count - 1
      setLoading(true)
      return await request<string[]>('key/list/lrange', keys.connection_id, {
        name: keys.name,
        db: keys.db,
        start,
        stop
      })
        .then((res) => {
          index.current = stop
          const more = stop >= keys.length
          if (reset) {
            setItems(res.data)
          } else {
            setItems((p) => {
              return [...p].concat(res.data)
            })
          }
          return {
            more
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [
      keys.connection_id,
      keys.db,
      keys.length,
      keys.name,
      store.setting.setting.field_count
    ]
  )

  const getAllFields = React.useCallback(() => {
    getFields().then((res) => {
      if (res.more) {
        getAllFields()
      }
    })
  }, [getFields])

  const data = React.useMemo(() => {
    return items.map((v, index) => {
      return {
        value: v,
        index
      }
    })
  }, [items])

  React.useEffect(() => {
    if (items.length >= keys.length) {
      setMore(false)
    } else {
      setMore(true)
    }
  }, [items.length, keys.length])

  React.useEffect(() => {
    index.current = 0
    getFields(true)
  }, [getFields])

  const columns = useTableColumn<APP.IndexValue>(
    [
      {
        title: t('Index'),
        dataIndex: 'index',
        align: 'center',
        width: 100
      },
      {
        dataIndex: 'value',
        title: t('Value'),
        width: 'auto',
        render(_) {
          return <FieldViewer content={_} />
        }
      }
    ],
    {
      title: t('Action'),
      width: 100,
      fixed: 'right',
      render(_, record, index) {
        return (
          <Space>
            <Editable connection={connection}>
              <LSet
                keys={keys}
                index={index}
                value={record.value}
                onSuccess={(value, index) => {
                  setItems((prev) => {
                    const newState = [...prev]
                    if (newState.length >= index + 1) {
                      newState[index] = value
                    }
                    return newState
                  })
                }}
              />
            </Editable>
          </Space>
        )
      }
    },
    connection !== undefined && !connection.readonly,
    false
  )
  return (
    <ValueLayout
      actions={
        <>
          <LInsert
            keys={keys}
            onSuccess={() => {
              onRefresh()
            }}
          />
          <LTrim
            keys={keys}
            onSuccess={() => {
              onRefresh()
            }}
          />
          <LPush
            keys={keys}
            onSuccess={() => {
              onRefresh()
            }}
          />
          <LPop
            keys={keys}
            onSuccess={() => {
              onRefresh()
            }}
          />
          <RPush
            keys={keys}
            onSuccess={() => {
              onRefresh()
            }}
          />
          <RPop
            keys={keys}
            onSuccess={() => {
              onRefresh()
            }}
          ></RPop>
        </>
      }
    >
      <CusTable
        showIndex={false}
        more={more}
        loading={loading}
        rowKey={'index'}
        onLoadMore={getFields}
        dataSource={data}
        columns={columns}
      ></CusTable>
      <div className="py-2 mb-4">
        <LoadMore
          disabled={!more}
          loading={loading}
          onGet={async () => {
            await getFields()
          }}
          onGetAll={getAllFields}
        ></LoadMore>
      </div>
    </ValueLayout>
  )
}
export default observer(Index)
