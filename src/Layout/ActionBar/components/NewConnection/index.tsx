import React from 'react'
import { observer } from 'mobx-react-lite'
import { LinkOutlined } from '@ant-design/icons'
import Template from '../Template'

import useStore from '@/hooks/useStore'
const NewConnection: React.FC = () => {
  const store = useStore()

  return (
    <Template
      title="Connection"
      icon={<LinkOutlined />}
      onClick={() => {
        store.connection.openForm()
      }}
    ></Template>
  )
}
export default observer(NewConnection)
