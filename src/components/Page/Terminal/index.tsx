import React from 'react'
import XTerm from '@/components/XTerm'
import Page from '..'
import request from '@/utils/request'
const Terminal: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = ({ connection, pageKey }) => {
  const prefix = React.useMemo(() => {
    return `${connection.host}:${connection.port}>`
  }, [connection.host, connection.port])

  const [welcome, setWelCome] = React.useState('')

  React.useEffect(() => {
    request('terminal/open', connection.id)
      .then((res) => {
        setWelCome('connected')
      })
      .catch((e) => {
        setWelCome(e)
      })
  }, [connection.id])

  return (
    <Page pageKey={pageKey}>
      {welcome !== '' && <XTerm prefix={prefix} welcome={welcome} />}
    </Page>
  )
}
export default Terminal
