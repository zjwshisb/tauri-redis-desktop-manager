import React from 'react'
import { observer } from 'mobx-react-lite'
import request from '@/utils/request'
import { type ListRef } from 'rc-virtual-list'
import { Button, Input, Space, Spin, Dropdown, Tooltip } from 'antd'
import { useDebounceFn } from 'ahooks'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  SmallDashOutlined
} from '@ant-design/icons'
import Key from '../Page/Key'
import useStore from '@/hooks/useStore'
import { type DB } from '@/store/db'
import Add from './components/Add'
import { useTranslation } from 'react-i18next'
import ResizableDiv from '@/components/ResizableDiv'
import { getPageKey, versionCompare } from '@/utils'
import List from './components/List'
import useKeyTypes from '@/hooks/useKeyTypes'

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

  const keyTypes = useKeyTypes()

  const db = React.useMemo(() => {
    return store.db.db
  }, [store.db.db])

  const { t } = useTranslation()

  const isShowTypeSelect = React.useMemo(() => {
    const r = db != null && versionCompare(db?.connection.version, '6.0.0') > -1
    if (!r) {
      types.current = ''
    }
    return r
  }, [db])

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
          count: store.setting.setting.key_count,
          db: current.db,
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
    [store.setting.setting.key_count, types]
  )

  const reload = React.useCallback(() => {
    getKeys(db, true)
  }, [getKeys, db])

  const typeSelect = React.useMemo(() => {
    if (isShowTypeSelect) {
      return (
        <Tooltip title={t('Type Select')} placement="left">
          <Dropdown
            trigger={['click']}
            menu={{
              selectable: true,
              onSelect(e) {
                cursor.current = '0'
                types.current = e.key
                getKeys(db, true)
              },
              items: [
                {
                  label: t('All'),
                  key: ''
                }
              ].concat(
                keyTypes.map((v) => {
                  return {
                    label: v.label,
                    key: v.value
                  }
                })
              )
            }}
          >
            <SmallDashOutlined className="hover:cursor-pointer" />
          </Dropdown>
        </Tooltip>
      )
    } else {
      return <></>
    }
  }, [db, getKeys, isShowTypeSelect, keyTypes, t])

  React.useEffect(() => {
    cursor.current = '0'
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
              {db != null && (
                <Space>
                  {typeSelect}
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
                getKeys(db)
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
