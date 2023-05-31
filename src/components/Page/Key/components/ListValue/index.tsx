import React from 'react'
import request from '@/utils/request'
import { Button, Space, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import LTrim from './components/LTrim'
import LSet from './components/LSet'
import LInsert from './components/LInsert'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'

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
      const stop = index.current + store.setting.field_count - 1
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
    [keys, store.setting.field_count]
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
      <Space className="mb-2">
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
      <Table
        loading={loading}
        pagination={false}
        scroll={{
          x: 'auto'
        }}
        rowKey={'index'}
        dataSource={items.map((v, index) => {
          return {
            value: v,
            index
          }
        })}
        bordered
        columns={[
          {
            title: t('Index'),
            dataIndex: 'index',
            align: 'center'
          },
          {
            dataIndex: 'value',
            title: t('Value')
          },
          {
            title: t('Action'),
            width: '300px',
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
      ></Table>
      <Button
        block
        disabled={!more}
        className="my-4"
        onClick={() => {
          getFields()
        }}
      >
        {t('Load More')}
      </Button>
    </div>
  )
}
export default observer(Index)
