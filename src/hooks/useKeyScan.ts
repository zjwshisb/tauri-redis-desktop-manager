import React from 'react'
import request from '@/utils/request'
import useStore from './useStore'
import { isArray, isString } from 'lodash'
import { useLatest } from 'ahooks'

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
export interface UseKeyScanOptions {
  beforeGet?: (rest: boolean) => void
  afterGet?: (rest: boolean) => void
}

export interface UseKeyScanFilter {
  types: string
  search: string
}

export function useKeyScan(
  connection: APP.Connection,
  db: number,
  params: UseKeyScanFilter,
  options?: UseKeyScanOptions
) {
  const getInitCursor = React.useCallback(() => {
    if (connection.is_cluster) {
      return connection.nodes.map((v) => {
        return {
          node: v,
          cursor: '0'
        }
      })
    } else {
      return '0'
    }
  }, [connection.is_cluster, connection.nodes])

  const cursor = React.useRef(getInitCursor())
  const store = useStore()

  const [keys, setKeys] = React.useState<string[]>([])

  const [more, setMore] = React.useState(false)

  const last = useLatest(options)

  const getKeys = React.useCallback(
    (reset: boolean = false) => {
      if (last.current?.beforeGet != null) {
        last.current?.beforeGet(reset)
      }
      if (reset) {
        cursor.current = getInitCursor()
      }
      let path = 'key/scan'
      if (connection.is_cluster) {
        path = 'cluster/scan'
      }
      request<SingleScanResp | ClusterScanResp>(path, connection.id, {
        cursor: cursor.current,
        count: store.setting.setting.key_count,
        db,
        ...params
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
          if (last.current?.afterGet != null) {
            last.current.afterGet(reset)
          }
          if (reset) {
            setKeys(res.data.keys)
          } else {
            setKeys((pre) => {
              return [...pre].concat(res.data.keys)
            })
          }
        })
        .finally(() => {})
    },
    [
      params,
      last,
      connection.is_cluster,
      connection.id,
      store.setting.setting.key_count,
      db,
      getInitCursor
    ]
  )

  React.useEffect(() => {
    getKeys(true)
  }, [getKeys])

  return {
    keys,
    getKeys,
    more
  }
}
