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
  }, [appName, window.label])

  return (
    <>
      <div className={"flex-shrink-0 w-32 h-full"}>
      </div>
      <div
        className="flex-1 h-full cursor-move flex justify-center items-center text-ellipsis"
        onMouseDown={(e) => {
          if (e.buttons === 1) {
            if (e.detail === 2) {
              window.toggleMaximize().then()
            } else {
              window.startDragging().then()
            }
          } else {
            e.preventDefault()
          }
        }}
      >
        <span>{title}</span>
      </div>
      <div className="flex items-center justify-end w-32 flex-shrink-0 ">
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
