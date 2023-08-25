import React from 'react'

export default function useArrayState<T>(maxSize = 100) {
  const [items, setItems] = React.useState<T[]>([])

  const append = React.useCallback(
    (t: T) => {
      setItems((prev) => {
        const newState = [...prev, t]
        if (newState.length > maxSize) {
          newState.splice(0, newState.length - maxSize)
        }
        return newState
      })
    },
    [maxSize]
  )

  const clear = React.useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    append,
    clear
  }
}
