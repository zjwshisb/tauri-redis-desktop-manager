import React from 'react'

const Editable: React.FC<
  React.PropsWithChildren<{
    connection?: APP.Connection
    feedback?: React.ReactNode
  }>
> = ({ connection, children, feedback = null }) => {
  if (connection === undefined || connection.readonly) {
    return <>{feedback}</>
  }
  return <>{children}</>
}
export default Editable
