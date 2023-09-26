import React from 'react'
import useStore from './useStore'
import { type SelectProps } from 'antd/lib'

export default function useConnectionOption(readonlyDisable = true) {
  const store = useStore()
  return React.useMemo((): SelectProps['options'] => {
    return store.connection.connections.map((v) => {
      return {
        label: v.name,
        value: v.id,
        disabled: readonlyDisable ? v.readonly : false
      }
    })
  }, [readonlyDisable, store.connection.connections])
}
