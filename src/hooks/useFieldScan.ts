import React from 'react'
import useStore from './useStore'
import request from '@/utils/request'

export function useFieldScan<T>(
  path: string,
  keys: APP.Key,
  params: Record<string, string> = {}
) {
  const store = useStore()

  const [fields, setFields] = React.useState<T[]>([])
  const cursor = React.useRef('0')
  const [more, setMore] = React.useState(false)

  const [loading, setLoading] = React.useState(false)

  const getFields = React.useCallback(
    async (reset = false) => {
      if (reset) {
        setMore(true)
        cursor.current = '0'
      }
      setLoading(true)
      return await request<{
        cursor: string
        values: T[]
      }>(path, keys.connection_id, {
        name: keys.name,
        db: keys.db,
        cursor: cursor.current,
        count: store.setting.setting.field_count,
        ...params
      })
        .then((res) => {
          cursor.current = res.data.cursor
          const isMore = res.data.cursor !== '0'
          setMore(isMore)
          if (reset) {
            setFields(res.data.values)
          } else {
            setFields((p) => [...p].concat(res.data.values))
          }
          return {
            fields: res.data.values,
            more: isMore
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [keys, params, path, store.setting.setting.field_count]
  )

  const getAllFields = React.useCallback(() => {
    getFields().then((res) => {
      if (res.more) {
        getAllFields()
      }
    })
  }, [getFields])

  React.useEffect(() => {
    getFields(true)
  }, [getFields])

  return {
    fields,
    more,
    loading,
    setFields,
    getFields,
    getAllFields
  }
}
