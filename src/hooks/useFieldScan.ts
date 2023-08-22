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
  const [more, setMore] = React.useState(true)

  const [loading, setLoading] = React.useState(false)

  const getFields = React.useCallback(
    (reset = false) => {
      if (reset) {
        setMore(true)
        cursor.current = '0'
      }
      setLoading(true)
      request<{
        cursor: string
        fields: T[]
      }>(path, keys.connection_id, {
        name: keys.name,
        db: keys.db,
        cursor: cursor.current,
        count: store.setting.setting.field_count,
        ...params
      })
        .then((res) => {
          cursor.current = res.data.cursor
          if (res.data.cursor === '0') {
            setMore(false)
          } else {
            setMore(true)
          }
          if (reset) {
            setFields(res.data.fields)
          } else {
            setFields((p) => [...p].concat(res.data.fields))
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [keys, params, path, store.setting.setting.field_count]
  )

  React.useEffect(() => {
    getFields(true)
  }, [getFields])

  return {
    fields,
    more,
    loading,
    setFields,
    getFields
  }
}
