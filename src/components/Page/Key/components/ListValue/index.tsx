import React from 'react'
import request from '@/utils/request'
import { Button, Space, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import LTrim from './components/LTrim'
import LSet from './components/LSet'
import LInsert from './components/LInsert'

const pageSize = 30

const Index: React.FC<{
  keys: APP.ListKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [items, setItems] = React.useState<string[]>([])

  const [more, setMore] = React.useState(true)

  const { t } = useTranslation()

  const p = React.useRef(1)

  const getFields = React.useCallback(
    async (page: number, reset = false) => {
      const start = pageSize * (page - 1)
      const stop = pageSize * page - 1
      await request<string[]>('key/list/lrange', keys.connection_id, {
        name: keys.name,
        db: keys.db,
        start,
        stop
      }).then((res) => {
        if (reset) {
          setItems(res.data)
        } else {
          setItems((p) => {
            return [...p].concat(res.data)
          })
        }
      })
    },
    [keys]
  )

  React.useEffect(() => {
    if (items.length >= keys.length) {
      setMore(false)
    } else {
      setMore(true)
    }
  }, [items.length, keys.length])

  React.useEffect(() => {
    p.current = 1
    getFields(p.current, true).then(() => {
      p.current++
    })
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
            title: 'index',
            dataIndex: 'index',
            align: 'center'
          },
          {
            dataIndex: 'value',
            title: 'value'
          },
          {
            title: 'action',
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
      {more && (
        <Button
          block
          className="my-4"
          onClick={() => {
            getFields(p.current).then(() => {
              p.current++
            })
          }}
        >
          {t('load more')}
        </Button>
      )}
    </div>
  )
}
export default Index
