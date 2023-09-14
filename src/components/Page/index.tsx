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
      <div className="py-4">
        <PageFloatButton
          onRefresh={props.onRefresh}
          pageKey={props.pageKey}
        ></PageFloatButton>
        {props.children}
      </div>
    </Spin>
  )
}
export default Page
