import { getName } from '@tauri-apps/api/app'
import React from 'react'

export default function useAppName() {
  const [name, setName] = React.useState('')

  React.useEffect(() => {
    getName().then((r) => {
      setName(r)
    })
  }, [])

  return name
}
