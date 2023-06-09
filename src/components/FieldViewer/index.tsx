import React from 'react'
import ReactJson from 'react-json-view'
import lodash from 'lodash'
import Copy from '@/components/Copy'
import { blue } from '@ant-design/colors'
import { useDebounceFn } from 'ahooks'
import { Dropdown } from 'antd'

import formatter from './Types'
import { type MenuItemType } from 'antd/es/menu/hooks/useItems'

const FieldViewer: React.FC<{
  content: string
}> = ({ content }) => {
  const [types, setTypes] = React.useState<string>('text')

  const [loading, setLoading] = React.useState(false)

  const [isOrigin, setIsOrigin] = React.useState(true)

  const [child, setChild] = React.useState<React.ReactNode | null | string>()

  const init = React.useRef(false)

  const menus = React.useMemo(() => {
    const m: MenuItemType[] = []
    Object.keys(formatter).forEach((v) => {
      m.push({
        label: formatter[v].label,
        key: formatter[v].key
      })
    })
    return m
  }, [])

  React.useEffect(() => {
    try {
      const u = JSON.parse(content)
      if (lodash.isPlainObject(u)) {
        // setFormatContent(u)
        // setTypes('json')
      } else {
        // setFormatContent(content)
        setTypes('text')
      }
    } catch (_) {
      // setFormatContent(content)
      setTypes('text')
    }
    init.current = true
  }, [content])

  React.useEffect(() => {
    if (init.current) {
      setLoading(true)
      const item = formatter[types]
      const f = item.format(content)
      setIsOrigin(f === content)
      if (item.component != null) {
        const node = item.component(item.format(content))
        setChild(node)
      } else {
        setChild(f)
      }

      setLoading(false)
    }
  }, [content, types])

  const [isFocus, setIsFocus] = React.useState(false)

  const mouseLeave = useDebounceFn(
    () => {
      setIsFocus(false)
    },
    {
      wait: 100
    }
  )

  const typeNode = React.useMemo(() => {
    if (isFocus || !isOrigin) {
      return (
        <Dropdown
          menu={{
            onClick(e) {
              setTypes(e.key)
              console.log(e)
            },
            items: menus
          }}
        >
          <div
            style={{
              color: blue.primary
            }}
            className="absolute bottom-[16px] right-[16px] hover:cursor-pointer"
            onClick={() => {}}
          >
            {types}
          </div>
        </Dropdown>
      )
    }
    return <></>
  }, [isFocus, isOrigin, menus, types])

  // const child = React.useMemo(() => {
  //   switch (types) {
  //     case 'json': {
  //       if (lodash.isPlainObject(formatContent)) {
  //         return (
  //           <ReactJson
  //             validationMessage="error"
  //             displayDataTypes={false}
  //             indentWidth={2}
  //             sortKeys={true}
  //             style={{
  //               wordBreak: 'break-all'
  //             }}
  //             collapseStringsAfterLength={200}
  //             enableClipboard
  //             src={formatContent}
  //             name={false}
  //             quotesOnKeys={false}
  //             collapsed={1}
  //           ></ReactJson>
  //         )
  //       }
  //       return formatContent
  //     }
  //     default: {
  //       return (
  //         <div>
  //           {lodash.isString(formatContent) && formatContent}
  //           {isFocus && (
  //             <Copy
  //               content={content}
  //               style={{ color: blue.primary }}
  //               className="ml-1"
  //             ></Copy>
  //           )}
  //         </div>
  //       )
  //     }
  //   }
  // }, [types, formatContent, isFocus, content])
  return (
    <div
      className="my-[-16px] py-[16px] break-all"
      onMouseLeave={() => {
        mouseLeave.run()
      }}
      onMouseEnter={() => {
        mouseLeave.cancel()
        setIsFocus(true)
      }}
    >
      {child}
      {typeNode}
    </div>
  )
}
export default FieldViewer
