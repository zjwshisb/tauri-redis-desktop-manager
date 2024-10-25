import React from 'react'
import { type Enable, Resizable } from 're-resizable'

const ResizableDiv: React.FC<
  React.PropsWithChildren<{
    minWidth?: number
    maxWidth?: number
    className?: string
    defaultWidth?: number
    defaultHeight?: number
    minHeight?: number
    maxHeight?: number
    enable?: Enable
  }>
> = (props) => {
  const [width, setWidth] = React.useState(props.defaultWidth)
  const [height, setHeight] = React.useState(props.defaultHeight)

  const {
    enable = {
      right: true,
      top: false,
      bottom: false,
      left: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
      topLeft: false
    }
  } = props

  return (
    <Resizable
      className={props.className}
      minWidth={props.minWidth}
      maxWidth={props.maxWidth}
      minHeight={props.minHeight}
      maxHeight={props.maxHeight}
      onResizeStop={(e, direction, ref, d) => {
        setWidth((p) => {
          if (p !== undefined) {
            return p + d.width
          }
          return undefined
        })
        setHeight((p) => {
          if (p !== undefined) {
            return p + d.height
          }
          return undefined
        })
      }}
      enable={enable}
      size={{
        width: width === undefined ? '100%' : width,
        height: height === undefined ? '100%' : height
      }}
    >
      {props.children}
    </Resizable>
  )
}

export default ResizableDiv
