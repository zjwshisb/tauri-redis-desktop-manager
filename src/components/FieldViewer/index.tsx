import React from 'react'
import lodash from 'lodash'
import Copy from '@/components/Copy'
import { blue, gold } from '@ant-design/colors'
import { useDebounceFn } from 'ahooks'
import { Dropdown } from 'antd'

import formatter from './Types'
import { type MenuItemType } from 'antd/es/menu/hooks/useItems'

const FieldViewer: React.FC<{
  content: string
}> = ({ content }) => {
  const [types, setTypes] = React.useState<string>('text')

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
    if (!init.current) {
      try {
        const u = JSON.parse(content)
        if (lodash.isPlainObject(u)) {
          setTypes('json')
        } else {
          setTypes('text')
        }
      } catch (_) {
        setTypes('text')
      }
      init.current = true
    }
  }, [content])

  React.useEffect(() => {
    if (init.current) {
      const item = formatter[types]
      if (item !== undefined) {
        const f = item.format(content)
        setIsOrigin(f === content)
        if (item.component != null) {
          const node = item.component(item.format(content))
          setChild(node)
        } else {
          setChild(f)
        }
      }
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
            },
            items: menus
          }}
        >
          <div
            style={{
              color: gold.primary
            }}
            className="absolute bottom-[16px] right-[16px] hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              if (types !== 'text') {
                setTypes('text')
              }
            }}
          >
            {types}
          </div>
        </Dropdown>
      )
    }
    return <></>
  }, [isFocus, isOrigin, menus, types])
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
      {isFocus && types === 'text' && (
        <Copy
          content={content}
          style={{ color: blue.primary }}
          className="ml-1"
        ></Copy>
      )}
    </div>
  )
}
export default FieldViewer
