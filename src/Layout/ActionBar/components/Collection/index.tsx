import React from 'react'
import { observer } from 'mobx-react-lite'
import { StarOutlined } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import Template from '../Template'

const Index: React.FC = () => {
  const store = useStore()

  return (
    <Template
      icon={<StarOutlined />}
      title="Collection"
      onClick={() => {
        store.page.addPage({
          type: 'collection',
          name: 'collection'
        })
      }}
    />
  )
}
export default observer(Index)
