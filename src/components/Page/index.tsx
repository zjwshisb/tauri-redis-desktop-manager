import React from 'react'
import PageFloatButton from '../PageFloatButton'
import { Spin } from 'antd'
import classNames from 'classnames'

interface PageProps {
  pageKey: string
  onRefresh?: () => void
  loading?: boolean
  wFull?: boolean
  collected?: boolean
  className?: string
  noPadding?: boolean
}

const Page: React.FC<React.PropsWithChildren<PageProps>> = (props) => {
  const { noPadding = false } = props

  return (
    <Spin
      className="w-full"
      spinning={props.loading === undefined ? false : props.loading}
    >
      <div
        className={classNames([
          !noPadding && 'p-3',
          props.wFull === true && 'w-screen',
          props.className
        ])}
      >
        <PageFloatButton
          collected={props.collected}
          onRefresh={props.onRefresh}
          pageKey={props.pageKey}
        ></PageFloatButton>

        {props.children}
      </div>
    </Spin>
  )
}
export default Page
