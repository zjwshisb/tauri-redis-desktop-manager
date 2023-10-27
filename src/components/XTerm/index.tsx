import React from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

interface XTermProps {
  className?: string
  welcome?: string
}

const XTerm: React.ForwardRefRenderFunction<Terminal, XTermProps> = (
  props: XTermProps,
  ref: React.ForwardedRef<Terminal>
) => {
  const div = React.useRef<HTMLDivElement>(null)
  const init = React.useRef(false)
  const [term] = React.useState<Terminal>(
    new Terminal({
      fontSize: 16,
      cursorBlink: false,
      rows: 20,
      disableStdin: true,
      convertEol: true
      // 终端中的回滚量
      // 光标闪烁
    })
  )
  React.useImperativeHandle(ref, () => term)

  //   const currentLine = React.useRef('')

  React.useLayoutEffect(() => {
    if (!init.current) {
      init.current = true
      if (div.current != null) {
        term.open(div.current)
        // term.write('$ ')
        const fit = new FitAddon()
        term.loadAddon(fit)
        term.blur()
        if (props.welcome !== undefined) {
          term.writeln(props.welcome)
        }

        // term.onKey((e) => {
        //   switch (e.domEvent.key) {
        //     case 'Enter': {
        //       currentLine.current = ''
        //       term.write('\r\n$ ')
        //       term.focus()
        //       break
        //     }
        //     case 'Backspace': {
        //       if (currentLine.current.length > 0) {
        //         console.log(currentLine.current.length)
        //         currentLine.current = currentLine.current.slice(
        //           0,
        //           currentLine.current.length - 1
        //         )
        //         term.write('\b \b')
        //       }
        //       break
        //     }
        //     default: {
        //       currentLine.current += e.key
        //       term.write(e.key)
        //     }
        //   }
        // })
        // term.onData((s) => {
        //   console.log(s)
        //   if (s.length > 1) {
        //     currentLine.current += s
        //     term.write(s)
        //   }
        // })
        fit.fit()
        // term.focus()
      }
    }
  }, [term, props.welcome])

  return <div ref={div} className={props.className}></div>
}
export default React.forwardRef<Terminal, XTermProps>(XTerm)
