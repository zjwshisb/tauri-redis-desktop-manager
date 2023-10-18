import React from 'react'
import lodash from 'lodash'
import Copy from '@/components/Copy'
import { blue, gold } from '@ant-design/colors'
import { useDebounceFn } from 'ahooks'
import { Dropdown, Spin } from 'antd'

import formatter, { type TypeFormat } from './Types'
import { MenuOutlined } from '@ant-design/icons'
import { type MenuItemType } from 'antd/es/menu/hooks/useItems'

const FieldViewer: React.FC<{
  content: string
  defaultType?: string
  typesArr?: Array<TypeFormat['key']>
}> = ({ content, defaultType = 'text', typesArr }) => {
  const [types, setTypes] = React.useState<string>(defaultType)

  const [isOrigin, setIsOrigin] = React.useState(true)

  const [child, setChild] = React.useState<React.ReactNode>()

  const [loading, setLoading] = React.useState(false)

  const [init, setInit] = React.useState(false)

  const menus = React.useMemo(() => {
    const m: MenuItemType[] = []
    Object.keys(formatter)
      .filter((v) => {
        if (typesArr !== undefined) {
          return typesArr.find((t) => t === v)
        } else {
          return true
        }
      })
      .forEach((v) => {
        m.push({
          label: formatter[v].label,
          key: formatter[v].key
        })
      })
    return m
  }, [typesArr])

  const change = React.useCallback(async (t: string, c: string) => {
    const item = formatter[t]
    if (item !== undefined) {
      setLoading(true)
      setIsOrigin(t === 'text')
      setChild(await item.render(c))
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (!init) {
      let type = 'text'
      try {
        const u = JSON.parse(content)
        if (lodash.isObject(u)) {
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
            className="ml-2 inline hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              if (types !== 'text') {
                setTypes('text')
              }
            }}
          >
            {formatter[types]?.label}
            <MenuOutlined size={6} className="ml-1 text-xs" />
          </div>
        </Dropdown>
      )
    }
    return <></>
  }, [isFocus, isOrigin, menus, types])

  return (
    <Spin spinning={loading}>
      <div
        className="break-all"
        onMouseLeave={() => {
          mouseLeave.run()
        }}
        onMouseEnter={() => {
          mouseLeave.cancel()
          setIsFocus(true)
        }}
      >
        {init && child}
        {isFocus && types === 'text' && (
          <Copy
            content={content}
            style={{ color: blue.primary }}
            className="ml-2"
          ></Copy>
        )}
        {typeNode}
      </div>
    </Spin>
  )
}
export default FieldViewer
