import React from 'react'
import { FloatButton } from 'antd'
import { ReloadOutlined, WindowsOutlined } from '@ant-design/icons'
import { isMainWindow } from '@/utils'
import useStore from '@/hooks/useStore'
import { observer } from 'mobx-react-lite'
import Collect from './collect'

const isMain = isMainWindow()

const PageFloatButton: React.FC<{
  onRefresh?: () => void
  pageKey?: string
  collected?: boolean
}> = ({ onRefresh, pageKey, collected = true }) => {
  const store = useStore()

  if (onRefresh === undefined && !isMain) {
    return (
      <>
        <FloatButton.BackTop
          style={{ top: '40%', bottom: 'auto', right: 10 }}
          shape="square"
          target={() => {
            const target = document.getElementById('container')
            return target as HTMLElement
          }}
        />
      </>
    )
  }

  return (
    <FloatButton.Group
      shape="square"
      style={{ top: '40%', bottom: 'auto', right: 10 }}
    >
      {pageKey !== undefined && collected && (
        <Collect pageKey={pageKey}></Collect>
      )}
      {isMain && pageKey !== undefined && (
        <FloatButton
          icon={<WindowsOutlined />}
          onClick={() => {
            if (pageKey !== undefined) {
              store.page.openPageInNewWindowByKey(pageKey)
            }
          }}
        ></FloatButton>
      )}

      {onRefresh !== undefined && (
        <FloatButton
          onClick={onRefresh}
          icon={<ReloadOutlined></ReloadOutlined>}
        ></FloatButton>
      )}

      <FloatButton.BackTop
        target={() => {
          const target = document.getElementById('container')
          return target as HTMLElement
        }}
      />
    </FloatButton.Group>
  )
}
export default observer(PageFloatButton)
