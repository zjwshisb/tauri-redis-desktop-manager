import React from 'react'
import { Resizable } from 're-resizable'

const ResizableDiv: React.FC<
  React.PropsWithChildren<{
    minWidth: number
    maxWidth: number
    className?: string
    defaultWidth: number
  }>
> = (props) => {
  const [width, setWidth] = React.useState(props.defaultWidth)

  return (
    <Resizable
      className={props.className}
      minWidth={props.minWidth}
      maxWidth={props.maxWidth}
      onResizeStop={(e, direction, ref, d) => {
        setWidth((p) => p + d.width)
      }}
      enable={{
        right: true
      }}
      size={{
        width,
        height: '100%'
      }}
    >
      {props.children}
    </Resizable>
  )
}

export default ResizableDiv
