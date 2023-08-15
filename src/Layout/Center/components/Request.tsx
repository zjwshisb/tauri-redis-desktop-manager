import React from 'react'
import { observer } from 'mobx-react-lite'
import request from '@/utils/request'
import { type ListRef } from 'rc-virtual-list'
import { Input, Space, Tooltip } from 'antd'
import { useDebounceFn } from 'ahooks'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import { useTranslation } from 'react-i18next'
import List from './List'
import { type KeyInfo } from '@/store/key'
import LoadMore from './LoadMore'
import { isArray, isString } from 'lodash'
import Key from '@/components/Page/Key'
import TypeSelect from './TypeSelect'

import { getPageKey } from '@/utils'
import Add from './Add'

interface SingleScanResp {
  cursor: string
  keys: string[]
}
interface ClusterScanResp {
  cursor: Array<{
    cursor: string
    node: string
  }>
  keys: string[]
}

const Index: React.FC<{
  listHeight: number
  listRef: React.RefObject<ListRef>
  loading: boolean
  onLoadingChange: (b: boolean) => void
  keyInfo: KeyInfo
}> = ({ listHeight, listRef, loading, onLoadingChange, keyInfo }) => {
  const store = useStore()

  const getInitCursor = React.useCallback(() => {
    if (keyInfo.connection.is_cluster) {
      return keyInfo.connection.nodes.map((v) => {
        return {
          node: v,
          cursor: '0'
        }
      })
    } else {
      return '0'
    }
  }, [keyInfo.connection.is_cluster, keyInfo.connection.nodes])

  const cursor = React.useRef(getInitCursor())

  const [keys, setKeys] = React.useState<string[]>([])

  const [more, setMore] = React.useState(false)

  const search = React.useRef('')

  const types = React.useRef('')

  const { t } = useTranslation()

  const onSearchChange = useDebounceFn((s: string) => {
    search.current = s
    getKeys(true)
  })

  const getKeys = React.useCallback(
    (reset: boolean = false) => {
      onLoadingChange(true)
      if (reset) {
        cursor.current = getInitCursor()
      }
      let path = 'key/scan'
      if (keyInfo.connection.is_cluster) {
        path = 'cluster/scan'
      }
      request<SingleScanResp | ClusterScanResp>(path, keyInfo.connection.id, {
        cursor: cursor.current,
        search: search.current,
        count: store.setting.setting.key_count,
        db: keyInfo.db,
        types: types.current
      })
        .then((res) => {
          if (isArray(res.data.cursor)) {
            const respCursor = res.data.cursor.filter((v) => {
              return v.cursor !== '0'
            })
            if (respCursor.length === 0) {
              setMore(false)
            } else {
              setMore(true)
            }
          } else if (isString(res.data.cursor)) {
            if (res.data.cursor === '0') {
              setMore(false)
            } else {
              setMore(true)
            }
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
    },
    [
      getInitCursor,
      keyInfo.connection.id,
      keyInfo.connection.is_cluster,
      keyInfo.db,
      listRef,
      onLoadingChange,
      store.setting.setting.key_count
    ]
  )

  React.useEffect(() => {
    getKeys(true)
  }, [getInitCursor, getKeys])

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
            <TypeSelect
              connection={keyInfo.connection}
              onChange={(e) => {
                types.current = e
                getKeys(true)
              }}
            />
            <Tooltip title={t('Refresh')}>
              <ReloadOutlined
                className="hover:cursor-pointer text-lg"
                onClick={() => {
                  getKeys(true)
                }}
              />
            </Tooltip>
            <Add
              onSuccess={(name: string) => {
                const key = getPageKey(name, keyInfo.connection, keyInfo.db)
                store.page.addPage({
                  key,
                  label: key,
                  type: 'key',
                  connection: keyInfo.connection,
                  name,
                  db: keyInfo.db,
                  children: (
                    <Key
                      name={name}
                      db={keyInfo.db}
                      connection={keyInfo.connection}
                      pageKey={key}
                    ></Key>
                  )
                })
              }}
              info={keyInfo}
            />
          </Space>
        </div>
      </div>
      <List info={keyInfo} keys={keys} height={listHeight} listRef={listRef} />
      <LoadMore
        disabled={!more}
        loading={loading}
        onClick={() => {
          getKeys()
        }}
      />
    </>
  )
}

export default observer(Index)
