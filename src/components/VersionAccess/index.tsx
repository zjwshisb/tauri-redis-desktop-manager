import React from 'react'

import { versionCompare } from '@/utils'
import { observer } from 'mobx-react-lite'
import { computed } from 'mobx'
const VersionAccess: React.FC<
  React.PropsWithChildren<{
    version: string
    connection?: APP.Connection
    feedback?: React.ReactNode
  }>
> = ({ version, connection, feedback = <></>, children }) => {
  const isShow = computed(() => {
    if (connection?.version !== undefined) {
      return versionCompare(connection.version, version) > -1
    }

    return false
  })

  if (!isShow.get()) {
    return <>{feedback}</>
  }

  return <>{children}</>
}

export default observer(VersionAccess)
