import React from 'react'

export default function useSearchParam<T extends string>(): Partial<Record<T, string>> {
    const location = window.location

    return React.useMemo(() => {
        if (location.search.length <= 1) {
            return {}
        } else {
            const str = location.search.substring(1)
            const r: Record<string, string> = {}
            str.split('&').forEach(v => {
                const arr = v.split('=')
                if (arr.length === 2) {
                    r[arr[0]] = arr[1]
                }
            })
            return r
        }
    }, [location.search])
}
