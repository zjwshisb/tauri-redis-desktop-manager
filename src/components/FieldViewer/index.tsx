import React from 'react'
import lodash from 'lodash'
import Copy from '@/components/Copy'
import { blue, gold } from '@ant-design/colors'
import { useDebounceFn } from 'ahooks'
import { Dropdown } from 'antd'

import formatter from './Types'
import { MenuOutlined } from '@ant-design/icons'
import { type MenuItemType } from 'antd/es/menu/hooks/useItems'

const FieldViewer: React.FC<{
  content: string
  defaultType?: string
}> = ({ content, defaultType = 'text' }) => {
  const [types, setTypes] = React.useState<string>(defaultType)

  const [isOrigin, setIsOrigin] = React.useState(true)

  const [child, setChild] = React.useState<React.ReactNode>()

  const [init, setInit] = React.useState(false)

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

  const change = React.useCallback((t: string, c: string) => {
    const item = formatter[t]
    if (item !== undefined) {
      setIsOrigin(t === 'text')
      setChild(item.render(c))
    }
  }, [])

  React.useEffect(() => {
    if (!init) {
      let type = 'text'
      try {
        const u = JSON.parse(content)
        if (lodash.isPlainObject(u)) {
          type = 'json'
        }
      } catch (_) {}
      setTypes(type)
      change(type, content)
      setInit(true)
    }
  }, [change, content, init])

  React.useEffect(() => {
    if (init) {
      change(types, content)
    }
  }, [content, change, types, init])

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
            <MenuOutlined size={6} className="ml-1 text-xs" />
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
      {init && child}
      {typeNode}
      {isFocus && types === 'text' && (
        <Copy
          content={content}
          style={{ color: blue.primary }}
          className="ml-2"
        ></Copy>
      )}
    </div>
  )
}
export default FieldViewer
