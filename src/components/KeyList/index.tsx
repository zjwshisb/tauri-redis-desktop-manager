import React from 'react'
import { observer } from 'mobx-react-lite'
import request from '@/utils/request'
import VirtualList from 'rc-virtual-list'
import {
  Button,
  Input,
  Tooltip,
  Typography,
  Empty,
  Space,
  Spin,
  List
} from 'antd'
import { useDebounceFn } from 'ahooks'
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import { Resizable } from 're-resizable'
import Key from '../Page/Key'
import useStore from '@/hooks/useStore'
import { type DB } from '@/store/db'
import Plus from './components/Plus'
import { useTranslation } from 'react-i18next'

interface ScanResp {
  cursor: string
  keys: string[]
}

const Index: React.FC = () => {
  const store = useStore()

  const cursor = React.useRef('0')

  const [keys, setKeys] = React.useState<string[]>([])

  const [loading, setLoading] = React.useState(false)

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
          .finally(() => {
            setLoading(false)
          })
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

  const [height, setHeight] = React.useState(0)

  React.useLayoutEffect(() => {
    const container = document.getElementById(id)
    if (container != null) {
      setHeight(container.clientHeight - 46 - 32 - 10)
    }
  }, [id])

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
      <div
        className="flex flex-col h-screen overflow-hidden   bg-white"
        id={id}
      >
        {/* <div className="py-2 px-2  bg-white flex item-center">
          <Input
            prefix={<SearchOutlined />}
            placeholder={'search'}
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
        </div> */}
        <List
          bordered={false}
          size="small"
          loading={loading}
          footer={
            <Button
              loading={loading}
              icon={<PlusOutlined />}
              block
              onClick={() => {
                getKeys(db)
              }}
            >
              {t('Load More')}
            </Button>
          }
          header={
            <div className="py-2 px-2  bg-white flex item-center">
              <Input
                prefix={<SearchOutlined />}
                placeholder={'search'}
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
          }
        >
          <VirtualList
            data={keys}
            itemKey={(v) => v}
            itemHeight={47}
            height={height}
          >
            {(v) => {
              return (
                <List.Item
                  key={v}
                  className="hover:white hover:cursor-pointer hover:bg-sky-200"
                >
                  <Typography.Text
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
                </List.Item>
              )
            }}
          </VirtualList>
        </List>

        {more && keys.length > 0 && (
          <div className="px-2">
            <Button
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
        )}
        {/* {keys.length === 0 && <Empty />} */}
      </div>
    </Resizable>
  )
}

export default observer(Index)
