import React from 'react'

import { useSpring, animated } from '@react-spring/web'
import classNames from 'classnames'
import { useSize } from 'ahooks'

const Collapse: React.FC<
  React.PropsWithChildren<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > & {
      collapse: boolean
      defaultHeight: number
      onHeightChange?: (isOverHeight: boolean) => void
    }
  >
> = ({
  collapse,
  defaultHeight,
  onHeightChange = undefined,
  children,
  ...otherProps
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [styles, api] = useSpring(
    {
      height: defaultHeight
    },
    []
  )

  const trigger = React.useCallback(
    (open: boolean) => {
      if (open && containerRef.current) {
        api.start({
          height: containerRef.current.clientHeight,
          config: {
            duration: 300
          }
        })
      } else {
        api.start({
          height: defaultHeight,
          config: {
            duration: 300
          }
        })
      }
    },
    [api, defaultHeight]
  )

  const size = useSize(containerRef)

  React.useLayoutEffect(() => {
    trigger(collapse)
  }, [collapse, trigger])

  const lastWidth = React.useRef<number>(0)

  // change height when width change
  React.useEffect(() => {
    if (size?.width) {
      if (size.width !== lastWidth.current) {
        if (collapse && containerRef.current) {
          api.start({
            height: containerRef.current.clientHeight
          })
        }
      }
    }
    if (containerRef.current) {
      if (onHeightChange) {
        onHeightChange(containerRef.current.clientHeight > defaultHeight + 1)
      }
    }
  }, [api, collapse, defaultHeight, onHeightChange, size])

  return (
    <animated.div
      className={classNames([
        'flex relative flex-col overflow-hidden',
        otherProps.className
      ])}
      style={styles}
    >
      <div ref={containerRef}>{children}</div>
    </animated.div>
  )
}
export default Collapse
