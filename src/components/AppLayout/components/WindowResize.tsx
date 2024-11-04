import React from 'react'
import { observer } from 'mobx-react-lite'
import { getCurrentWindow } from '@tauri-apps/api/window'

const WindowResize: React.FC = () => {
  const window = getCurrentWindow()

  return (
    <React.Fragment>
      <div
        className="w-2 h-2 fixed bg-transparent top-0 left-0 cursor-nw-resize z-20"
        onMouseDown={async () => {
          await window.startResizeDragging('NorthWest')
        }}
      ></div>
      <div
        className="w-2 h-2 fixed bg-transparent top-0 right-0 cursor-ne-resize z-20"
        onMouseDown={async () => {
          await window.startResizeDragging('NorthEast')
        }}
      ></div>
      <div
        className="w-2 h-2 fixed bg-transparent bottom-0 left-0 cursor-sw-resize z-20"
        onMouseDown={async () => {
          await window.startResizeDragging('SouthWest')
        }}
      ></div>
      <div
        className="w-2 h-2 fixed bg-transparent bottom-0 right-0 cursor-se-resize z-20"
        onMouseDown={async () => {
          await window.startResizeDragging('SouthEast')
        }}
      ></div>
      <div
        className="w-[calc(100%-2rem)] mx-4  fixed h-1 bg-transparent top-0 cursor-n-resize"
        onMouseDown={async () => {
          await window.startResizeDragging('North')
        }}
      ></div>
      <div
        className="w-[calc(100%-2rem)] mx-4 fixed h-1 bg-transparent bottom-0 cursor-s-resize z-10"
        onMouseDown={async () => {
          await window.startResizeDragging('South')
        }}
      ></div>
      <div
        className="h-[calc(100%-2rem)] my-4 fixed w-1 bg-transparent left-0 cursor-w-resize z-10"
        onMouseDown={async () => {
          await window.startResizeDragging('West')
        }}
      ></div>
      <div
        className="h-[calc(100%-2rem)] my-4 fixed w-1 bg-transparent right-0 cursor-e-resize z-10"
        onMouseDown={async () => {
          await window.startResizeDragging('East')
        }}
      ></div>
    </React.Fragment>
  )
}

export default observer(WindowResize)
