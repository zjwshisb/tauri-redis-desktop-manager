import React from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import lodash from 'lodash'
import Container from '../Container'
import classNames from 'classnames'
interface XTermProps {
  className?: string
}

const XTerm: React.ForwardRefRenderFunction<Terminal, XTermProps> = (
  props: XTermProps,
  ref: React.ForwardedRef<Terminal>
) => {
  const div = React.useRef<HTMLDivElement>(null)
  const container = React.useRef<HTMLDivElement>(null)

  const [term, setTerm] = React.useState<Terminal | null>(null)

  const currentLine = React.useRef('')

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
      fit.fit()

      item.loadAddon(fit)
      if (container.current != null) {
        const fn = lodash.debounce(() => {
          fit.fit()
        })
        const observer = new ResizeObserver((entries) => {
          fn()
        })
        observer.observe(container.current)
      }
      item.onData((s) => {
        if (s.length > 1) {
          currentLine.current += s
          item.write(s)
        }
      })
      fit.fit()
      setTerm(item)
    }
    return () => {
      item.dispose()
    }
  }, [])

  React.useImperativeHandle(ref, () => term as Terminal)

  return (
    <Container
      className={classNames([
        'bg-black rounded-md overflow-hidden border',
        props.className
      ])}
    >
      <div ref={container}>
        <div ref={div}></div>
      </div>
    </Container>
  )
}
export default React.forwardRef<Terminal, XTermProps>(XTerm)
