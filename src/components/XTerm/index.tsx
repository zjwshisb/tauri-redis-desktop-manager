import React from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import lodash from 'lodash'
import Container from '../Container'

interface XTermProps {
  className?: string
  welcome?: string
  prefix?: string
  onEnter?: (s: string) => void
  readonly?: boolean
}

const XTerm: React.ForwardRefRenderFunction<Terminal, XTermProps> = (
  props: XTermProps,
  ref: React.ForwardedRef<Terminal>
) => {
  const div = React.useRef<HTMLDivElement>(null)
  const container = React.useRef<HTMLDivElement>(null)
  const init = React.useRef(false)

  const { prefix = '$ ', onEnter, readonly = false } = props

  const history = React.useRef<string[]>([])

  const historyIndex = React.useRef<number>(0)

  const [term] = React.useState<Terminal>(
    new Terminal({
      fontSize: 16,
      cursorBlink: false,
      disableStdin: readonly,
      convertEol: true,
      cursorInactiveStyle: readonly ? 'none' : 'block'

      // 终端中的回滚量
      // 光标闪烁
    })
  )
  React.useImperativeHandle(ref, () => term)

  const currentLine = React.useRef('')

  React.useEffect(() => {
    return () => {
      // term.dispose()
    }
  }, [term])

  React.useLayoutEffect(() => {
    if (!init.current) {
      init.current = true
      if (div.current != null) {
        term.open(div.current)
        const fit = new FitAddon()
        fit.fit()

        term.loadAddon(fit)
        // term.blur()
        if (container.current != null) {
          const fn = lodash.debounce(() => {
            fit.fit()
          })
          const observer = new ResizeObserver((entries) => {
            fn()
          })
          observer.observe(container.current)
        }

        if (props.welcome !== undefined) {
          term.writeln(props.welcome)
        }
        if (!readonly) {
          term.write(prefix)
        }

        term.onData((s) => {
          // const f = iconv.encode(s, 'utf8')
          // const r = iconv.decode(f, 'utf8')
          // console.log(r)
          // term.write(f)
          // const b = decodeURIComponent(encodeURIComponent(s))
          // console.log(s)
          // console.log(b)
          // term.write(b)
          // term.paste(s)
          // term.write(b)
          // if (readonly) {
          //   return
          // }
          // if (s.length > 1) {
          //   currentLine.current += s
          //   term.write(s)
          // }
        })
        term.onKey((e) => {
          if (readonly) {
            return
          }

          switch (e.domEvent.key) {
            case 'Enter': {
              const cmd = currentLine.current
              if (cmd.length !== 0) {
                history.current.push(cmd)
                historyIndex.current = history.current.length - 1
                if (onEnter != null) {
                  onEnter(cmd)
                }
              }
              term.write('\r\n')
              term.write(prefix)
              term.focus()
              currentLine.current = ''
              return
            }
            case 'ArrowUp': {
              e.domEvent.stopPropagation()
              e.domEvent.preventDefault()
              if (history.current[historyIndex.current] !== undefined) {
                term.write(history.current[historyIndex.current])
                if (historyIndex.current > 0) {
                  historyIndex.current = historyIndex.current - 1
                }
              }
              return
            }
            case 'ArrowDown': {
              e.domEvent.stopPropagation()
              e.domEvent.preventDefault()

              historyIndex.current = historyIndex.current - 1
              if (historyIndex.current < 0) {
                historyIndex.current = 0
              }
              if (history.current[historyIndex.current] !== undefined) {
                term.write(history.current[historyIndex.current])
              }

              break
            }
            case 'ArrowLeft': {
              break
            }
            case 'ArrowRight': {
              break
            }
            case 'Backspace': {
              if (currentLine.current.length > 0) {
                currentLine.current = currentLine.current.slice(
                  0,
                  currentLine.current.length - 1
                )
                term.write('\b \b')
              }
              break
            }
            default: {
              currentLine.current += e.key
              // term.write(e.key)
            }
          }
        })

        fit.fit()
        // term.focus()
      }
    }
  }, [term, props.welcome, prefix, onEnter, readonly])

  return (
    <Container
      ref={container}
      className="bg-black rounded overflow-hidden border "
    >
      <div ref={div} className={props.className}></div>
    </Container>
  )
}
export default React.forwardRef<Terminal, XTermProps>(XTerm)
