import React from 'react'
import request from '@/utils/request'
import { Input, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import SAdd from './components/SAdd'
import SRem from './components/SRem'
import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'
import CusTable from '@/components/CusTable'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import Editable from '@/components/Editable'

interface SScanResp {
  cursor: string
  fields: string[]
}

const Index: React.FC<{
  keys: APP.SetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const store = useStore()

  const [items, setItems] = React.useState<string[]>([])

  const cursor = React.useRef('0')
  const [more, setMore] = React.useState(true)

  const search = React.useRef('')

  const { t } = useTranslation()
  const [loading, setLoading] = React.useState(false)

  const connection = React.useContext(context)

  const getFields = React.useCallback(
    async (reset = false) => {
      if (reset) {
        cursor.current = '0'
      }
      setLoading(true)
      await request<SScanResp>('key/set/sscan', keys.connection_id, {
        name: keys.name,
        db: keys.db,
        cursor: cursor.current,
        search: search.current,
        count: store.setting.setting.field_count
      })
        .then((res) => {
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
        .finally(() => {
          setLoading(false)
        })
    },
    [keys, store.setting.setting.field_count]
  )

  React.useEffect(() => {
    setMore(true)
    getFields(true).then()
  }, [getFields])

  return (
    <div>
      <Space className="pb-2">
        <Editable connection={connection}>
          <SAdd
            keys={keys}
            onSuccess={() => {
              onRefresh()
            }}
          ></SAdd>
        </Editable>
      </Space>
      <CusTable
        loading={loading}
        more={more}
        onLoadMore={getFields}
        rowKey={'value'}
        dataSource={items.map((v, index) => {
          return {
            index: index + 1,
            value: v
          }
        })}
        columns={[
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
            },
            render(_) {
              return <FieldViewer content={_}></FieldViewer>
            }
          },
          {
            title: t('Action'),
            width: '200px',
            fixed: 'right',
            align: 'center',
            render(_, record, index) {
              return (
                <Space>
                  <Editable connection={connection}>
                    <SRem
                      keys={keys}
                      value={record.value}
                      onSuccess={() => {
                        onRefresh()
                      }}
                    ></SRem>
                  </Editable>
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
