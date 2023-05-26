import React from 'react'
import request from '@/utils/request'
import { Button, Input, Space, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import SAdd from './components/SAdd'
import SRem from './components/SRem'

interface SScanResp {
  cursor: string
  fields: string[]
}

const Index: React.FC<{
  keys: APP.SetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [items, setItems] = React.useState<string[]>([])

  const cursor = React.useRef('0')
  const [more, setMore] = React.useState(true)

  const search = React.useRef('')

  const { t } = useTranslation()

  const getFields = React.useCallback(
    async (reset = false) => {
      await request<SScanResp>('key/set/sscan', keys.connection_id, {
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
    getFields(true).then()
  }, [getFields])

  return (
    <div>
      <Space className="mb-2">
        <SAdd
          keys={keys}
          onSuccess={() => {
            onRefresh()
          }}
        ></SAdd>
      </Space>
      <Table
        pagination={false}
        scroll={{
          x: 'auto'
        }}
        rowKey={'value'}
        dataSource={items.map((v, index) => {
          return {
            index: index + 1,
            value: v
          }
        })}
        bordered
        columns={[
          {
            title: '#',
            dataIndex: 'index',
            align: 'center'
          },
          {
            title: (
              <div className="flex items-center justify-center">
                <div>title</div>
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
            align: 'center',
            sorter: (a, b) => {
              return a.value > b.value ? 1 : -1
            }
          },

          {
            title: 'action',
            width: '200px',
            fixed: 'right',
            align: 'center',
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
          }
        ]}
      ></Table>
      {more && (
        <Button
          block
          className="my-4"
          onClick={() => {
            getFields()
          }}
        >
          {t('load more')}
        </Button>
      )}
    </div>
  )
}
export default Index
