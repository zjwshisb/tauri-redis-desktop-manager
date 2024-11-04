import React from 'react'
import request from '@/utils/request'
import useStore from './useStore'
import { isArray } from 'lodash'
import { useLatest } from 'ahooks'

export interface UseKeyScanOptions {
  beforeGet?: (rest: boolean) => void
  afterGet?: (rest: boolean) => void
  onErr?: () => void
}

export interface UseKeyScanFilter {
  types: string
  search: string
  exact?: boolean
}

export function useScanCursor<T = string>(connection: APP.Connection) {
  const getInitCursor = React.useCallback(() => {
    if (connection.is_cluster) {
      return connection.nodes?.map((v) => {
        return {
          node: v.id,
          cursor: '0'
        }
      })
    } else {
      return '0'
    }
  }, [connection.is_cluster, connection.nodes])

  const cursor = React.useRef(getInitCursor())

  const resetCursor = React.useCallback(() => {
    cursor.current = getInitCursor()
  }, [getInitCursor])

  const isInit = React.useCallback(() => {
    if (isArray(cursor.current)) {
      return cursor.current.filter((v) => v.cursor === '0').length === 0
    } else {
      return cursor.current === '0'
    }
  }, [])

  const setCursor = React.useCallback((res: APP.ScanLikeResp<T>) => {
    if (isArray(res.cursor)) {
      cursor.current = res.cursor.filter((v) => {
        return v.cursor !== '0'
      })
    } else {
      cursor.current = res.cursor
    }
  }, [])

  const isMore = React.useCallback((res: APP.ScanLikeResp<T>) => {
    if (isArray(res.cursor)) {
      const respCursor = res.cursor.filter((v) => {
        return v.cursor !== '0'
      })
      return respCursor.length !== 0
    }
    return res.cursor !== '0'
  }, [])
  return {
    cursor,
    resetCursor,
    isMore,
    isInit,
    setCursor
  }
}

export default function useKeyScan(
  connection: APP.Connection,
  db: number | undefined,
  params: UseKeyScanFilter,
  options?: UseKeyScanOptions
) {
  const { cursor, resetCursor, isMore, setCursor } = useScanCursor(connection)
  const store = useStore()

  const [keys, setKeys] = React.useState<string[]>([])

  const [more, setMore] = React.useState(false)

  const opts = useLatest(options)

  const getKeys = React.useCallback(
    async (reset: boolean = false) => {
      if (opts.current?.beforeGet != null) {
        opts.current?.beforeGet(reset)
      }
      if (reset) {
        resetCursor()
      }
      let path = 'key/scan'
      if (connection.is_cluster) {
        path = 'cluster/scan'
      }
      try {
        return await request<APP.ScanLikeResp>(path, connection.id, {
          cursor: cursor.current,
          count: store.setting.setting.key_count,
          db,
          ...params
        }).then((res) => {
          const hasMore = isMore(res.data)
          setMore(hasMore)
          setCursor(res.data)
          if (opts.current?.afterGet != null) {
            opts.current.afterGet(reset)
          }
          if (reset) {
            setKeys(res.data.values)
          } else {
            setKeys((pre) => {
              return [...pre].concat(res.data.values)
            })
          }
          return {
            data: res.data,
            hasMore
          }
        })
      } catch (e) {
        if (opts.current && opts.current.onErr) {
          opts.current.onErr()
        }
        throw e
      }
    },
    [
      opts,
      connection.is_cluster,
      connection.id,
      cursor,
      store.setting.setting.key_count,
      db,
      params,
      resetCursor,
      isMore,
      setCursor
    ]
  )

  const getAllKeys = React.useCallback(() => {
    getKeys().then((res) => {
      if (res.hasMore) {
        getAllKeys()
      }
    })
  }, [getKeys])

  return {
    keys,
    getKeys,
    more,
    getAllKeys,
    cursor
  }
}
