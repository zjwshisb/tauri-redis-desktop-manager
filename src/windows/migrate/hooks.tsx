import useStore from '@/hooks/useStore'
import React, { useContext } from 'react'
import Context from './context'

export function useTargetConnection() {
  const store = useStore()

  const [state] = useContext(Context)

  return React.useMemo(() => {
    return store.connection.connections.find(
      (v) => v.id === state.value?.target.connection_id
    )
  }, [state.value?.target.connection_id, store.connection.connections])
}

export function useSourceConnection() {
  const store = useStore()

  const [state] = useContext(Context)

  return React.useMemo(() => {
    return store.connection.connections.find(
      (v) => v.id === state.value?.source.connection_id
    )
  }, [state.value?.source.connection_id, store.connection.connections])
}
