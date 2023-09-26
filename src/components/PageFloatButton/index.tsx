import React from 'react'
import { FloatButton } from 'antd'
import { ReloadOutlined, WindowsOutlined } from '@ant-design/icons'
import { isMainWindow } from '@/utils'
import useStore from '@/hooks/useStore'

const isMain = isMainWindow()

const PageFloatButton: React.FC<{
  onRefresh?: () => void
  pageKey?: string
}> = ({ onRefresh, pageKey }) => {
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
      {isMain && pageKey !== undefined && (
        <FloatButton
          icon={<WindowsOutlined />}
          onClick={() => {
            if (pageKey !== undefined) {
              store.page.openNewWindowPageKey(pageKey)
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
export default PageFloatButton
