import React from 'react'

import { isReadonly } from '@/components/Editable'
import connectionContext from '../../context'
import { Space, Spin } from 'antd'

const ValueLayout: React.FC<
  React.PropsWithChildren<{
    actions?: React.ReactNode
    readonlyAction?: React.ReactNode
    loading?: boolean
    header?: React.ReactNode
  }>
> = ({ actions, children, header, readonlyAction, loading = false }) => {
  const connection = React.useContext(connectionContext)

  const toolbar = React.useMemo(() => {
    if (actions !== undefined || readonlyAction !== undefined) {
      return (
        <div className="flex items-center mb-2">
          <Space wrap={true}>
            {!isReadonly(connection) && actions}
            {readonlyAction}
          </Space>
        </div>
      )
    }
    return <></>
  }, [actions, connection, readonlyAction])

  return (
    <Spin spinning={loading}>
      {header !== undefined && <div className="mb-2">{header}</div>}
      {toolbar}
      <div>{children}</div>
    </Spin>
  )
}
export default ValueLayout
