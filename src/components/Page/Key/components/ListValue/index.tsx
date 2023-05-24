import React from 'react'
import request from '@/utils/request'
import { Space, Table } from 'antd'

const pageSize = 30

const Index: React.FC<{
  keys: APP.ListKey
}> = ({ keys }) => {
  const [items, setItems] = React.useState<string[]>([])

  const [loading, setLoading] = React.useState(false)

  const p = React.useRef(1)

  const getFields = React.useCallback((reset = false) => {
    const start = pageSize * (p.current - 1)
    const stop = pageSize * (p.current) - 1
    setLoading(true)
    request<string[]>('key/list/lrange', keys.connection_id, {
      name: keys.name,
      db: keys.db,
      start,
      stop
    }).then(res => {
      setLoading(false)
      setItems(res.data)
    })
  }, [keys])

  React.useEffect(() => {
    getFields()
  }, [getFields])

  return <div>
    <Table
      loading={loading}
      onChange={page => {
        if (page.current != null) {
          p.current = page.current
          getFields()
        }
      }}
      pagination={{
        total: keys.length,
        pageSize: 30
      }}
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
          render (_, record, index) {
            return <Space>

            </Space>
          }
        }
      ]}></Table>
    </div>
}
export default Index
