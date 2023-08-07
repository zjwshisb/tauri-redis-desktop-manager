import React from 'react'
import { observer } from 'mobx-react-lite'
import request from '@/utils/request'
import { type ListRef } from 'rc-virtual-list'
import { Button, Input, Space, Tooltip } from 'antd'
import { useDebounceFn } from 'ahooks'
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import { useTranslation } from 'react-i18next'
import List from './List'
import { type KeyInfo } from '@/store/key'

interface ScanResp {
  cursor: string
  keys: string[]
}

const Index: React.FC<{
  add: React.ReactNode
  listHeight: number
  listRef: React.RefObject<ListRef>
  loading: boolean
  onLoadingChange: (b: boolean) => void
  keyInfo: KeyInfo
}> = ({ add, listHeight, listRef, loading, onLoadingChange, keyInfo }) => {
  const store = useStore()

  const cursor = React.useRef('0')

  const [keys, setKeys] = React.useState<string[]>([])

  const [more, setMore] = React.useState(false)

  const search = React.useRef('')

  const types = React.useRef('')

  const { t } = useTranslation()

  const onSearchChange = useDebounceFn((s: string) => {
    cursor.current = '0'
    search.current = s
    getKeys(true)
  })

  const getKeys = React.useCallback(
    (reset: boolean = false) => {
      if (keyInfo !== null) {
        onLoadingChange(true)
        if (reset) {
          cursor.current = '0'
        }
        request<ScanResp>('key/scan', keyInfo.connection.id, {
          cursor: cursor.current,
          search: search.current,
          count: store.setting.setting.key_count,
          db: keyInfo.db,
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
            onLoadingChange(false)
          })
      }
    },
    [keyInfo, listRef, onLoadingChange, store.setting.setting.key_count]
  )

  const reload = React.useCallback(() => {
    getKeys(true)
  }, [getKeys])

  React.useEffect(() => {
    cursor.current = '0'
    // getKeys(true)
  }, [getKeys])

  return (
    <>
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
            {/* <TypeSelect
                    version={db.connection.version}
                    onChange={(e) => {
                      cursor.current = '0'
                      types.current = e
                      getKeys(true)
                    }}
                  /> */}
            <Tooltip title={t('Refresh')}>
              <ReloadOutlined
                className="hover:cursor-pointer text-lg"
                onClick={reload}
              />
            </Tooltip>
            {add}
          </Space>
        </div>
      </div>
      <List info={keyInfo} keys={keys} height={listHeight} listRef={listRef} />
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
    </>
  )
}

export default observer(Index)
