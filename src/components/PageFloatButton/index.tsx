import React from 'react'
import { FloatButton } from 'antd'
import { ReloadOutlined, WindowsOutlined } from '@ant-design/icons'
import { isMainWindow } from '@/utils'
import useStore from '@/hooks/useStore'

const isMain = isMainWindow()

const PageFloatButton: React.FC<{
  onRefresh?: () => void
  pageKey?: string
}> = (props) => {
  const store = useStore()

  if (props.onRefresh === undefined && !isMain) {
    return <></>
  }

  return (
    <FloatButton.Group
      shape="square"
      style={{ top: '40%', bottom: 'auto', right: 10 }}
    >
      {isMain && props.pageKey !== undefined && (
        <FloatButton
          icon={<WindowsOutlined />}
          onClick={() => {
            if (props.pageKey !== undefined) {
              store.page.openNewWindowPageKey(props.pageKey)
            }
          }}
        ></FloatButton>
      )}

      {props.onRefresh != null && (
        <FloatButton
          onClick={props.onRefresh}
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
