import React from 'react'

import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { Icon } from '@iconify/react'
import useAppName from '@/hooks/useAppName'

const TitleBar: React.FC = () => {
  const window = getCurrentWindow()

  const windowItemClass = 'w-10 h-full flex items-center justify-center'

  const appName = useAppName()

  const title = React.useMemo(() => {
    if (window.label !== 'main') {
      return window.label
    }
    return appName
  }, [appName])



  return (
    <>
      <div
        className="flex-1 h-full cursor-move flex items-center pl-2"
        onMouseDown={(e) => {
          if (e.buttons === 1) {
            e.detail === 2
              ? window.toggleMaximize() // Maximize on double click
              : window.startDragging()
          } else {
            e.preventDefault()
          }
        }}
      >
        <span>{title}</span>
      </div>
      <div className="flex items-center w-22">
        <div
          className={classNames(windowItemClass, 'hover:bg-gray-5 dark:hover:bg-gray-10')}
          onClick={(e) => {
            window.minimize().then()
            e.stopPropagation()
          }}
        >
          <Icon icon={'mdi:window-minimize'}></Icon>
        </div>
        <div
          className={classNames(windowItemClass, 'hover:bg-gray-5 dark:hover:bg-gray-10')}
          onClick={(e) => {
            window.toggleMaximize().then()
            e.stopPropagation()
          }}
        >
          <Icon icon={'mdi:window-maximize'}></Icon>
        </div>
        <div
          onClick={(e) => {
            window.close().then()
            e.stopPropagation()
          }}
          className={classNames(
            windowItemClass,
            'hover:bg-red-600 hover:text-white'
          )}
        >
          <Icon icon={'mdi:close'}></Icon>
        </div>
      </div>
    </>
  )
}

export default observer(TitleBar)
