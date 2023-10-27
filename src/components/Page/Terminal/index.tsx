import React from 'react'
import XTerm from '@/components/XTerm'
import Page from '..'
const Terminal: React.FC<{
  connection: APP.Connection
  pageKey: string
}> = (props) => {
  return (
    <Page pageKey={props.pageKey}>
      <XTerm />
    </Page>
  )
}
export default Terminal
