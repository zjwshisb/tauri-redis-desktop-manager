import React from 'react'
import { observer } from 'mobx-react-lite'
import request from '@/utils/request'
import { type ListRef } from 'rc-virtual-list'
import { Button, Input, Space, Spin, Tooltip } from 'antd'
import { useDebounceFn } from 'ahooks'
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import Key from '@/components/Page/Key'
import useStore from '@/hooks/useStore'
import Add from './components/Add'
import { useTranslation } from 'react-i18next'
import ResizableDiv from '@/components/ResizableDiv'
import { getPageKey } from '@/utils'
import List from './components/List'
import TypeSelect from './components/TypeSelect'

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

  const types = React.useRef('')

  const id = React.useId()

  const db = React.useMemo(() => {
    return store.db.db
  }, [store.db.db])

  const { t } = useTranslation()

  const onSearchChange = useDebounceFn((s: string) => {
    cursor.current = '0'
    search.current = s
    getKeys(true)
  })

  const getKeys = React.useCallback(
    (reset: boolean = false) => {
      if (db !== null) {
        setLoading(true)
        if (reset) {
          cursor.current = '0'
        }
        request<ScanResp>('key/scan', db.connection.id, {
          cursor: cursor.current,
          search: search.current,
          count: store.setting.setting.key_count,
          db: db.db,
          types: types.current
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
    [db, store.setting.setting.key_count]
  )

  const reload = React.useCallback(() => {
    getKeys(true)
  }, [getKeys])

  React.useEffect(() => {
    cursor.current = '0'
    getKeys(true)
  }, [getKeys])

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
              {db != null && (
                <Space>
                  <TypeSelect
                    version={db.connection.version}
                    onChange={(e) => {
                      cursor.current = '0'
                      types.current = e
                      getKeys(true)
                    }}
                  />
                  <Tooltip title={t('Refresh')}>
                    <ReloadOutlined
                      className="hover:cursor-pointer text-lg"
                      onClick={reload}
                    />
                  </Tooltip>
                  <Add
                    onSuccess={(name: string) => {
                      const key = getPageKey(name, db.connection, db.db)
                      store.page.addPage({
                        key,
                        label: key,
                        connectionId: db.connection.id,
                        children: (
                          <Key
                            name={name}
                            db={db.db}
                            connection={db.connection}
                            pageKey={key}
                          ></Key>
                        )
                      })
                    }}
                    db={db}
                  />
                </Space>
              )}
            </div>
          </div>
          <List db={db} keys={keys} height={listHeight} listRef={listRef} />
          <div className="p-2 border-t">
            <Button
              disabled={!more}
              loading={loading}
              icon={<PlusOutlined />}
              block
              onClick={() => {
                getKeys()
              }}
            >
              {t('Load More')}
            </Button>
          </div>
        </div>
      </Spin>
    </ResizableDiv>
  )
}

export default observer(Index)
