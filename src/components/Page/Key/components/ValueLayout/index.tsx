import React from 'react'

import Editable from '@/components/Editable'
import connectionContext from '../../context'
import { Space, Spin } from 'antd'

const ValueLayout: React.FC<
  React.PropsWithChildren<{
    actions?: React.ReactNode
    loading?: boolean
    header?: React.ReactNode
  }>
> = ({ actions, children, header, loading = false }) => {
  const connection = React.useContext(connectionContext)

  return (
    <div>
      {header !== undefined && <div className="mb-4">{header}</div>}

      <Editable connection={connection}>
        <div className="pb-2 flex items-center">
          <Space>{actions}</Space>
        </div>
      </Editable>
      <Spin spinning={loading}>{children}</Spin>
    </div>
  )
}
export default ValueLayout
