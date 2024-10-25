import { getVersion } from '@tauri-apps/api/app'
import React from 'react'

export default function useAppVersion() {
  const [version, setVersion] = React.useState('')

  React.useEffect(() => {
    getVersion().then((r) => {
      setVersion(r)
    })
  }, [])

  return version
}
