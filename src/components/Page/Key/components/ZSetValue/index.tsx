import React from 'react'
import request from '@/utils/request'
import { Button, Space, Table, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import ZRem from './components/ZRem'

interface ZScanResp {
  cursor: string
  fields: APP.ZSetField[]
}

const Index: React.FC<{
  keys: APP.ZSetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [items, setItems] = React.useState<APP.ZSetField[]>([])

  const cursor = React.useRef('0')
  const [more, setMore] = React.useState(true)

  const { t } = useTranslation()

  const p = React.useRef(1)

  const search = React.useRef('')

  const getFields = React.useCallback(
    async (reset = false) => {
      await request<ZScanResp>('key/zset/zscan', keys.connection_id, {
        name: keys.name,
        db: keys.db,
        cursor: cursor.current,
        search: search.current
      }).then((res) => {
        if (res.data.cursor === '0') {
          setMore(false)
        } else {
          setMore(true)
        }
        cursor.current = res.data.cursor
        if (reset) {
          setItems(res.data.fields)
        } else {
          setItems((p) => {
            return [...p].concat(res.data.fields)
          })
        }
      })
    },
    [keys]
  )

  React.useEffect(() => {
    cursor.current = '0'
    setMore(true)
    getFields(true)
  }, [getFields])

  return (
    <div>
      <Space className="mb-2"></Space>
      <Table
        pagination={false}
        scroll={{
          x: 'auto'
        }}
        rowKey={'value'}
        dataSource={items}
        bordered
        columns={[
          {
            title: '#',
            render(_, record, p) {
              return p + 1
            }
          },
          {
            title: (
              <div className="flex items-center justify-center">
                <div>value</div>
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
                      search.current = e
                      getFields(true)
                    }}
                  />
                </div>
              </div>
            ),
            dataIndex: 'value',
            align: 'center'
          },
          {
            dataIndex: 'score',
            title: 'score',
            sorter: (a, b) => {
              if (a.score === b.score) {
                return 0
              }
              return a.score > b.score ? 1 : -1
            }
          },
          {
            title: 'action',
            width: '300px',
            fixed: 'right',
            // eslint-disable-next-line @typescript-eslint/space-before-function-paren
            render(_, record, index) {
              return (
                <Space>
                  <ZRem
                    keys={keys}
                    value={record.value}
                    onSuccess={() => {
                      onRefresh()
                    }}
                  ></ZRem>
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
            getFields().then(() => {
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
