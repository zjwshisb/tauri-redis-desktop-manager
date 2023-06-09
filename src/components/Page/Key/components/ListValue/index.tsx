import React from 'react'
import request from '@/utils/request'
import { Space } from 'antd'
import { useTranslation } from 'react-i18next'
import LTrim from './components/LTrim'
import LSet from './components/LSet'
import LInsert from './components/LInsert'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'

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

  const getFields = React.useCallback(
    async (reset = false) => {
      const start = index.current
      const stop = index.current + store.setting.setting.field_count - 1
      setLoading(true)
      await request<string[]>('key/list/lrange', keys.connection_id, {
        name: keys.name,
        db: keys.db,
        start,
        stop
      })
        .then((res) => {
          index.current = stop
          if (reset) {
            setItems(res.data)
          } else {
            setItems((p) => {
              return [...p].concat(res.data)
            })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [keys, store.setting.setting.field_count]
  )

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

  return (
    <div>
      <Space className="pb-2">
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
      </Space>
      <CusTable
        showIndex={false}
        more={more}
        loading={loading}
        rowKey={'index'}
        onLoadMore={getFields}
        dataSource={items.map((v, index) => {
          return {
            value: v,
            index
          }
        })}
        columns={[
          {
            title: t('Index'),
            dataIndex: 'index',
            align: 'center',
            width: 100
          },
          {
            dataIndex: 'value',
            title: t('Value'),
            render(_) {
              return <FieldViewer content={_} />
            }
          },
          {
            title: t('Action'),
            width: 100,
            fixed: 'right',
            render(_, record, index) {
              return (
                <Space>
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
                </Space>
              )
            }
          }
        ]}
      ></CusTable>
    </div>
  )
}
export default observer(Index)
