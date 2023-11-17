import React from 'react'
import { useLatest } from 'ahooks'
import request, { type RequestOptions } from '../utils/request'

export default function useRequest<T>(
  cmd: string,
  cid: number = 0,
  args: Record<string, any> = {},
  immediately = true,
  options: RequestOptions = {
    showNotice: true
  }
) {
  const [data, setData] = React.useState<T>()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [init, setInit] = React.useState(false)
  const argsRef = useLatest(args)

  const optionRef = useLatest(options)

  const fetch = React.useCallback(() => {
    setLoading(true)
    request<T>(cmd, cid, argsRef.current, optionRef.current)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        setError(err as string)
      })
      .finally(() => {
        setInit(true)
        setLoading(false)
      })
  }, [cmd, cid, argsRef, optionRef])

  React.useEffect(() => {
    if (immediately) {
      fetch()
    }
  }, [fetch, immediately])

  const set = React.useCallback((t: T) => {
    setData(t)
  }, [])

  return {
    error,
    data,
    set,
    fetch,
    loading,
    init
  }
}
