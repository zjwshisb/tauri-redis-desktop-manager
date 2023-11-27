import React from 'react'

import { versionCompare } from '@/utils'
import { observer } from 'mobx-react-lite'
import { computed } from 'mobx'
const VersionAccess: React.FC<
  React.PropsWithChildren<{
    version: string
    connection?: APP.Connection
    feedback?: React.ReactNode
    type?: 'greater' | 'less'
  }>
> = ({ version, connection, feedback = <></>, type = 'greater', children }) => {
  const isShow = computed(() => {
    if (connection?.version !== undefined) {
      const compare = versionCompare(connection.version, version)
      return type === 'greater' ? compare > -1 : compare < 0
    }
    return false
  })

  if (!isShow.get()) {
    return <>{feedback}</>
  }

  return <>{children}</>
}

export default observer(VersionAccess)
