import React from 'react'
import PageFloatButton from '../PageFloatButton'
import { Spin } from 'antd'

interface PageProps {
  pageKey: string
  onRefresh?: () => void
  loading?: boolean
}

const Page: React.FC<React.PropsWithChildren<PageProps>> = (props) => {
  return (
    <Spin spinning={props.loading === undefined ? false : props.loading}>
      <PageFloatButton
        onRefresh={props.onRefresh}
        pageKey={props.pageKey}
      ></PageFloatButton>
      {props.children}
    </Spin>
  )
}
export default Page
