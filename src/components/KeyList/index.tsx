import React from 'react'
import { observer } from 'mobx-react-lite'
import request from '@/utils/request'
import { Button, Input, Tooltip, Typography, Affix, Empty } from 'antd'
import { useDebounceFn } from 'ahooks'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { Resizable } from 're-resizable'
import Key from '../Page/Key'
import useStore from '@/hooks/useStore'
import { type DB } from '@/store/db'

interface ScanResp {
  cursor: string
  keys: string[]
}

const Index: React.FC = () => {
  const store = useStore()

  const cursor = React.useRef('0')

  const [keys, setKeys] = React.useState<string[]>([])

  const search = React.useRef('')

  const [more, setMore] = React.useState(true)

  const [width, setWidth] = React.useState(250)

  const id = React.useId()

  const db = React.useMemo(() => {
    if (store.db.db.length > 0) {
      return store.db.db[0]
    } else {
      return null
    }
  }, [store.db.db])

  const onSearchChange = useDebounceFn((s: string) => {
    search.current = s
    cursor.current = '0'
    getKeys(db, true)
  })

  const getKeys = React.useCallback(
    (current: DB | null, reset: boolean = false) => {
      if (current !== null) {
        if (reset) {
          cursor.current = '0'
        }
        request<ScanResp>('key/scan', current.connection.id, {
          cursor: cursor.current,
          search: search.current,
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
            } else {
              setKeys((pre) => {
                return [...pre].concat(res.data.keys)
              })
            }
          })
          .finally(() => {})
      }
    },
    []
  )

  const reload = React.useCallback(() => {
    cursor.current = '0'
    getKeys(db, true)
  }, [getKeys, db])

  React.useEffect(() => {
    getKeys(db, true)
  }, [getKeys, db])

  return (
    <Resizable
      className={'h-screen border-r'}
      minWidth={'200px'}
      onResizeStop={(e, direction, ref, d) => {
        setWidth((p) => p + d.width)
      }}
      enable={{
        right: true
      }}
      size={{
        width,
        height: '100%'
      }}
    >
      <div>
        <div
          className="flex flex-col px-2  overflow-hidden h-[100vh] overflow-y-auto bg-white"
          id={id}
        >
          <Affix
            offsetTop={0}
            target={() => {
              return document.getElementById(id)
            }}
          >
            <div className="py-2 bg-white flex item-center">
              <Input
                prefix={<SearchOutlined />}
                placeholder={'search'}
                value={search.current}
                allowClear
                onChange={(e) => {
                  onSearchChange.run(e.target.value)
                }}
              />
              <div className="w-[20px] flex-shrink-0 flex item-center pl-2 justify-center">
                <ReloadOutlined
                  className="hover:cursor-pointer blue-sky"
                  onClick={reload}
                />
              </div>
            </div>
          </Affix>
          {keys.map((v) => {
            return (
              <Tooltip key={v} mouseEnterDelay={0.5} title={v}>
                <Typography.Text
                  className="flex-shrink-0 rounded hover:white hover:cursor-pointer hover:bg-sky-200"
                  ellipsis={true}
                  onClick={(e) => {
                    if (db !== null) {
                      const key = `${v}|${db.connection.host}:${db.connection.port}`
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
                >
                  {v}
                </Typography.Text>
              </Tooltip>
            )
          })}
          {more && keys.length > 0 && (
            <div className="mb-4">
              <Button
                block
                onClick={() => {
                  getKeys(db)
                }}
              >
                load more
              </Button>
            </div>
          )}
          {keys.length === 0 && <Empty />}
        </div>
      </div>
    </Resizable>
  )
}

export default observer(Index)
