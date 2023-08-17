import React from 'react'
import request from '@/utils/request'
import { Button, Space, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import ZRem from './components/ZRem'
import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'
import Form from './components/Form'
import { EditOutlined } from '@ant-design/icons'
import CusTable from '@/components/CusTable'
import IconButton from '@/components/IconButton'
import FieldViewer from '@/components/FieldViewer'
import context from '../../context'
import Editable from '@/components/Editable'

interface ZScanResp {
  cursor: string
  fields: APP.ZSetField[]
}

const Index: React.FC<{
  keys: APP.ZSetKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const store = useStore()

  const [items, setItems] = React.useState<APP.ZSetField[]>([])

  const connection = React.useContext(context)

  const cursor = React.useRef('0')
  const [more, setMore] = React.useState(true)

  const { t } = useTranslation()

  const search = React.useRef('')

  const getFields = React.useCallback(
    async (reset = false) => {
      if (reset) {
        cursor.current = '0'
      }
      await request<ZScanResp>('key/zset/zscan', keys.connection_id, {
        name: keys.name,
        db: keys.db,
        cursor: cursor.current,
        search: search.current,
        count: store.setting.setting.field_count
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
    [keys, store.setting.setting.field_count]
  )

  React.useEffect(() => {
    getFields(true)
  }, [getFields])

  return (
    <div>
      <div className="pb-2">
        <Space>
          <Editable connection={connection}>
            <Form
              onSuccess={onRefresh}
              keys={keys}
              trigger={<Button type="primary">ZAdd</Button>}
            ></Form>
          </Editable>
        </Space>
      </div>
      <CusTable
        more={more}
        onLoadMore={getFields}
        rowKey={'value'}
        dataSource={items}
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
            render(_) {
              return <FieldViewer content={_} />
            }
          },
          {
            dataIndex: 'score',
            title: t('Score'),
            width: 200,
            sorter: (a, b) => {
              if (a.score === b.score) {
                return 0
              }
              return a.score > b.score ? 1 : -1
            }
          },
          {
            title: t('Action'),
            width: 200,
            fixed: 'right',
            render(_, record, index) {
              return (
                <Space>
                  <Editable connection={connection}>
                    <ZRem
                      keys={keys}
                      value={record.value}
                      onSuccess={() => {
                        onRefresh()
                      }}
                    ></ZRem>
                  </Editable>
                  <Editable connection={connection}>
                    <Form
                      onSuccess={onRefresh}
                      keys={keys}
                      field={record}
                      trigger={<IconButton icon={<EditOutlined />} />}
                    ></Form>
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
