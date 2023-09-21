import React from 'react'
import useStore from './useStore'
import { type DefaultOptionType } from 'antd/es/select'

export default function useConnectionOption() {
  const store = useStore()
  return React.useMemo((): DefaultOptionType[] => {
    return store.connection.connections.map((v) => {
      return {
        label: v.name,
        value: v.id
      }
    })
  }, [store.connection.connections])
}
