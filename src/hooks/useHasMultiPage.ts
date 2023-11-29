import React from 'react'
import useStore from './useStore'

export default function useHasMultiPage() {
  const store = useStore()
  return React.useMemo(() => {
    return store.window.name === 'main' || store.window.name === 'database'
  }, [store.window.name])
}
