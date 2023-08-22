import React from 'react'

import { versionCompare } from '@/utils'
const VersionAccess: React.FC<
  React.PropsWithChildren<{
    version: string
    connection: APP.Connection
    feedback?: React.ReactNode
  }>
> = ({ version, connection, feedback = <></>, children }) => {
  const isShow = React.useMemo(() => {
    if (connection.version !== undefined) {
      return versionCompare(connection.version, version) > -1
    }
    return false
  }, [connection.version, version])

  if (!isShow) {
    return <>{feedback}</>
  }

  return <>{children}</>
}

export default VersionAccess
