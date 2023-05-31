import React from 'react'
import { observer } from 'mobx-react-lite'
import request from '@/utils/request'
import VirtualList, { type ListRef } from 'rc-virtual-list'
import { Button, Input, Typography, Empty, Space, Spin, List } from 'antd'
import { useDebounceFn } from 'ahooks'
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import Key from '../Page/Key'
import useStore from '@/hooks/useStore'
import { type DB } from '@/store/db'
import Plus from './components/Plus'
import { useTranslation } from 'react-i18next'
import ResizableDiv from '@/components/ResizableDiv'

interface ScanResp {
  cursor: string
  keys: string[]
}

const Index: React.FC = () => {
  const store = useStore()

  const cursor = React.useRef('0')

  const [keys, setKeys] = React.useState<string[]>([])
  const [more, setMore] = React.useState(false)

  const [loading, setLoading] = React.useState(false)

  const listRef = React.useRef<ListRef>(null)

  const search = React.useRef('')

  const id = React.useId()

  const db = React.useMemo(() => {
    if (store.db.db.length > 0) {
      return store.db.db[0]
    } else {
      return null
    }
  }, [store.db.db])

  const { t } = useTranslation()

  const onSearchChange = useDebounceFn((s: string) => {
    cursor.current = '0'
    search.current = s
    getKeys(db, true)
  })

  const getKeys = React.useCallback(
    (current: DB | null, reset: boolean = false) => {
      if (current !== null) {
        setLoading(true)
        if (reset) {
          cursor.current = '0'
        }
        request<ScanResp>('key/scan', current.connection.id, {
          cursor: cursor.current,
          search: search.current,
          count: store.setting.key_count,
          db: current.db
        })
          .then((res) => {
            if (res.data.cursor === '0') {
              setMore(false)
            } else {
              setMore(true)
            }
            cursor.current = res.data.cursor
            if (reset) {
              setKeys(res.data.keys)
              listRef.current?.scrollTo(0)
            } else {
              setKeys((pre) => {
                return [...pre].concat(res.data.keys)
              })
            }
          })
          .finally(() => {
            setLoading(false)
          })
      }
    },
    [store.setting.key_count]
  )

  const reload = React.useCallback(() => {
    cursor.current = '0'
    getKeys(db, true)
  }, [getKeys, db])

  React.useEffect(() => {
    getKeys(db, true)
  }, [getKeys, db])

  const [listHeight, setListHeight] = React.useState(0)

  const getListHeight = React.useCallback(() => {
    const container = document.getElementById(id)
    if (container != null) {
      setListHeight(container.clientHeight - 71 - 30)
    }
  }, [id])

  const getListHeightDb = useDebounceFn(getListHeight, {
    wait: 100
  })

  React.useLayoutEffect(() => {
    getListHeight()
  }, [getListHeight])

  React.useEffect(() => {
    window.addEventListener('resize', getListHeightDb.run)
    return () => {
      window.removeEventListener('resize', getListHeightDb.run)
    }
  }, [getListHeightDb])

  return (
    <ResizableDiv
      className={'h-screen border-r'}
      minWidth={200}
      defaultWidth={250}
      maxWidth={500}
    >
      <Spin spinning={loading}>
        <div
          className="flex flex-col h-screen overflow-hidden   bg-white"
          id={id}
        >
          <div className="py-2 px-2  bg-white flex item-center border-b">
            <Input
              prefix={<SearchOutlined />}
              placeholder={t('search').toString()}
              allowClear
              onChange={(e) => {
                onSearchChange.run(e.target.value)
              }}
            />
            <div className="flex-shrink-0 flex item-center px-2 justify-center">
              <Space>
                <ReloadOutlined
                  className="hover:cursor-pointer text-lg"
                  onClick={reload}
                />
                <Plus onSuccess={() => {}} db={db} />
              </Space>
            </div>
          </div>
          {keys.length === 0 && (
            <div
              className="flex items-center justify-center"
              style={{
                height: listHeight
              }}
            >
              <Empty description={'No Key'} />
            </div>
          )}
          {keys.length > 0 && (
            <List bordered={false} size="small">
              <VirtualList
                ref={listRef}
                data={keys}
                itemKey={(v) => v}
                itemHeight={39}
                height={listHeight}
              >
                {(v) => {
                  return (
                    <List.Item
                      key={v}
                      onClick={(e) => {
                        if (db !== null) {
                          const key = `${v}|${db.connection.host}:${db.connection.port}`
                          console.log('v')
                          store.page.addPage({
                            key,
                            label: key,
                            children: (
                              <Key
                                name={v}
                                db={db.db}
                                connection={db.connection}
                                pageKey={key}
                              ></Key>
                            )
                          })
                          e.stopPropagation()
                        }
                      }}
                      className="hover:cursor-pointer hover:bg-gray-100 border-none h-[37px]"
                    >
                      <Typography.Text ellipsis={true}>{v}</Typography.Text>
                    </List.Item>
                  )
                }}
              </VirtualList>
            </List>
          )}

          <div className="p-2 border-t">
            <Button
              disabled={!more}
              loading={loading}
              icon={<PlusOutlined />}
              block
              onClick={() => {
                getKeys(db)
              }}
            >
              {t('Load More')}
            </Button>
          </div>
          {/* {keys.length === 0 && <Empty />} */}
        </div>
      </Spin>
    </ResizableDiv>
  )
}

export default observer(Index)
