import React from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import lodash, { isArray, isNull, isNumber, isString } from 'lodash'
import classNames from 'classnames'
import ResizableDiv from '../ResizableDiv'
interface XTermProps {
  className?: string
  onReady?: (term: Terminal) => void
  defaultHeight?: number
  minHeight?: number
  resize?: boolean
}

export interface XTermAction {
  write: (data: string) => void
  writeln: (data: string) => void
  writeRedisResult: (data: any, prefix?: string) => void
  scrollToBottom: () => void
  clear: () => void
}

const XTerm: React.ForwardRefRenderFunction<XTermAction, XTermProps> = (
  props: XTermProps,
  ref: React.ForwardedRef<XTermAction>
) => {
  const div = React.useRef<HTMLDivElement>(null)

  const [term, setTerm] = React.useState<Terminal | null>(null)

  const { defaultHeight = 396, minHeight = 300, resize = true } = props

  React.useImperativeHandle(ref, () => {
    return {
      clear() {
        term?.clear()
      },
      scrollToBottom() {
        term?.scrollToBottom()
      },
      write(data) {
        term?.write(data)
      },
      writeln(data) {
        term?.writeln(data)
      },

      writeRedisResult(data: any, prefix = '', quota = true) {
        if (isNull(data)) {
          term?.writeln(`${prefix}(nil)`)
        }
        if (isString(data)) {
          if (quota) {
            term?.writeln(`${prefix}"${data}"`)
          } else {
            term?.writeln(`${prefix}${data}`)
          }
        }
        if (isNumber(data)) {
          term?.writeln(`${prefix}(integer)${data}`)
        }
        if (isArray(data)) {
          if (data.length === 0) {
            this.writeRedisResult('(empty array)', prefix, false)
          }
          data.forEach((v, index) => {
            if (index === 0) {
              this.writeRedisResult(v, prefix + `${index + 1})`)
            } else {
              this.writeRedisResult(
                v,
                ' '.repeat(prefix.length) + `${index + 1})`
              )
            }
          })
        }
      }
    }
  })

  const onReadyFn = React.useRef(props.onReady)

  React.useEffect(() => {
    const item = new Terminal({
      fontSize: 16,
      cursorBlink: false,
      disableStdin: true,
      convertEol: true,
      cursorInactiveStyle: 'none'
    })
    if (div.current != null) {
      item.open(div.current)
      const fit = new FitAddon()
      item.loadAddon(fit)
      const fn = lodash.debounce(() => {
        fit.fit()
      })
      const observer = new ResizeObserver(() => {
        fn()
      })
      observer.observe(div.current)
      fit.fit()
      setTerm(item)
      if (onReadyFn.current != null) {
        onReadyFn.current(item)
      }
    }
    return () => {
      item.dispose()
    }
  }, [])

  return (
    <ResizableDiv
      defaultHeight={defaultHeight}
      minHeight={minHeight}
      enable={
        resize
          ? {
              bottom: true
            }
          : undefined
      }
    >
      <div
        ref={div}
        className={classNames([
          'bg-black rounded-md overflow-hidden border h-full pl-1 pt-1 pb-1',
          props.className
        ])}
      ></div>
    </ResizableDiv>
  )
}
export default React.forwardRef<XTermAction, XTermProps>(XTerm)
