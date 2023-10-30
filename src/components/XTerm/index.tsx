import React from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

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
  const init = React.useRef(false)

  const { prefix = '$ ', onEnter, readonly = false } = props

  const [term] = React.useState<Terminal>(
    new Terminal({
      fontSize: 16,
      cursorBlink: false,
      rows: 40,
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
        term.loadAddon(fit)
        // term.blur()

        div.current.addEventListener('resize', () => {
          fit.fit()
        })
        if (props.welcome !== undefined) {
          term.writeln(props.welcome)
        }
        if (!readonly) {
          term.write(prefix)
        }

        term.onData((s) => {
          if (readonly) {
            return
          }
          if (s.length > 1) {
            currentLine.current += s
            term.write(s)
          }
        })
        term.onKey((e) => {
          if (readonly) {
            return
          }
          switch (e.domEvent.key) {
            case 'Enter': {
              const cmd = currentLine.current
              if (cmd.length !== 0) {
                if (onEnter != null) {
                  onEnter(cmd)
                }
              }
              term.write('\r\n')
              term.write(prefix)
              term.focus()
              currentLine.current = ''
              break
            }
            case 'ArrowUp': {
              break
            }
            case 'ArrowDown': {
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
              term.write(e.key)
            }
          }
        })

        fit.fit()
        // term.focus()
      }
    }
  }, [term, props.welcome, prefix, onEnter, readonly])

  return <div ref={div} className={props.className}></div>
}
export default React.forwardRef<Terminal, XTermProps>(XTerm)
