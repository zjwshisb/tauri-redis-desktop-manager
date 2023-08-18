import React from 'react'

export default function useSearchParam<
  T extends Record<string, string>
>(): Partial<T> {
  const location = window.location

  return React.useMemo(() => {
    const r: Partial<T> = {}
    if (location.search.length <= 1) {
      return r
    } else {
      const str = location.search.substring(1)
      str.split('&').forEach((v) => {
        const arr = v.split('=')
        if (arr.length === 2) {
          // @ts-expect-error todo
          // todo
          r[arr[0]] = arr[1]
        }
      })
      return r
    }
  }, [location.search])
}
