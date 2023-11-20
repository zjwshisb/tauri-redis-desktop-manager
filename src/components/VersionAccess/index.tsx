import React from 'react'

import { versionCompare } from '@/utils'
import { observer } from 'mobx-react-lite'
import { computed } from 'mobx'
const VersionAccess: React.FC<
  React.PropsWithChildren<{
    version: string
    connection?: APP.Connection
    feedback?: React.ReactNode
    type?: 'more' | 'less'
  }>
> = ({ version, connection, feedback = <></>, type = 'more', children }) => {
  const isShow = computed(() => {
    if (connection?.version !== undefined) {
      const compare = versionCompare(connection.version, version)
      return type === 'more' ? compare > -1 : compare < 1
    }
    return false
  })

  if (!isShow.get()) {
    return <>{feedback}</>
  }

  return <>{children}</>
}

export default observer(VersionAccess)
