import React from 'react'
import PageFloatButton from '../PageFloatButton'
import { Spin } from 'antd'
import classNames from 'classnames'

interface PageProps {
  pageKey: string
  onRefresh?: () => void
  loading?: boolean
  wFull?: boolean
}

const Page: React.FC<React.PropsWithChildren<PageProps>> = (props) => {
  const [buttonVisible, setButtonVisible] = React.useState(false)

  return (
    <Spin
      className="w-full"
      spinning={props.loading === undefined ? false : props.loading}
    >
      <div
        className={classNames(['p-3', props.wFull === true && 'w-screen'])}
        onMouseLeave={() => {
          setButtonVisible(false)
        }}
        onMouseEnter={() => {
          setButtonVisible(true)
        }}
      >
        {buttonVisible && (
          <PageFloatButton
            onRefresh={props.onRefresh}
            pageKey={props.pageKey}
          ></PageFloatButton>
        )}

        {props.children}
      </div>
    </Spin>
  )
}
export default Page
