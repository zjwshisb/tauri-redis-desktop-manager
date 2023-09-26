import React from 'react'

import Editable from '@/components/Editable'
import connectionContext from '../../context'
import { Space } from 'antd'

const ValueLayout: React.FC<
  React.PropsWithChildren<{
    actions?: React.ReactNode
  }>
> = ({ actions, children }) => {
  const connection = React.useContext(connectionContext)

  return (
    <div>
      <Editable connection={connection}>
        <div className="pb-2 flex items-center">
          <Space>{actions}</Space>
        </div>
      </Editable>
      {children}
    </div>
  )
}
export default ValueLayout
