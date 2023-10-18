import React from 'react'

export function isReadonly(connection: APP.Connection | undefined) {
  return connection === undefined || connection.readonly
}

const Editable: React.FC<
  React.PropsWithChildren<{
    connection?: APP.Connection
    feedback?: React.ReactNode
  }>
> = ({ connection, children, feedback = null }) => {
  if (isReadonly(connection)) {
    return <>{feedback}</>
  }
  return <>{children}</>
}
export default Editable
