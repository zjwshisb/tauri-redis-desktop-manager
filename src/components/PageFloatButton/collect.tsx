import React from 'react'
import { FloatButton } from 'antd'
import { StarOutlined, StarFilled } from '@ant-design/icons'
import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'

const Collect: React.FC<{
  pageKey: string
}> = ({ pageKey }) => {
  const store = useStore()

  if (store.collection.isCollected(pageKey)) {
    return (
      <FloatButton
        icon={<StarFilled />}
        onClick={() => {
          store.collection.removeByPageKey(pageKey)
        }}
        type="primary"
      ></FloatButton>
    )
  }
  return (
    <FloatButton
      icon={<StarOutlined />}
      onClick={() => {
        store.collection.addByPageKey(pageKey)
      }}
    ></FloatButton>
  )
}
export default observer(Collect)
