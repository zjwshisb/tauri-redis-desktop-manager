import React from 'react'
import { useLatest } from 'ahooks'
import request from '../utils/request'

export default function useRequest<T> (cmd: string, args: Record<string, any> = {}) {
  const [data, setData] = React.useState<T>()
  const argsRef = useLatest(args)

  const fetch = React.useCallback(() => {
    request<T>(cmd, argsRef.current).then(res => {
      setData(res.data)
    }).catch(() => {})
  }, [cmd])

  React.useEffect(() => {
    fetch()
  }, [fetch])

  return {
    data,
    fetch
  }
}
