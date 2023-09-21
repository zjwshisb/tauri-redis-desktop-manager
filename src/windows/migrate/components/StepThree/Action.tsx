import React from 'react'

import 'mac-scrollbar/dist/mac-scrollbar.css'

import useKeyScan from '@/hooks/useKeyScan'
import VirtualList from 'rc-virtual-list'
import { Descriptions } from 'antd'
import { useTranslation } from 'react-i18next'

interface ActionProps {
  onKeyLoadBefore: () => void
  onKeyLoadAfter: () => void
  onKeyLoadStop: () => void
  source: {
    connection: APP.Connection
    database?: number
  }
  target: {
    connection: APP.Connection
    database?: number
  }
  config: {
    pattern: string
    replace: boolean
    delete: boolean
  }
}
export interface ActionRef {
  loadKeys: (reset?: boolean) => void
  stop: () => void
}

interface KeyItem {
  name: string
  status: 'waiting' | 'success' | 'failed'
  message?: string
}

function nameToItem(name: string): KeyItem {
  return {
    name,
    status: 'waiting',
    message: ''
  }
}

const Action: React.ForwardRefRenderFunction<ActionRef, ActionProps> = (
  { source, target, config, onKeyLoadBefore, onKeyLoadAfter, onKeyLoadStop },
  ref
) => {
  const { t } = useTranslation()

  const [keys, setKeys] = React.useState<KeyItem[]>([])
  const stopSign = React.useRef(false)

  const filter = React.useMemo(() => {
    return {
      search: config.pattern,
      types: ''
    }
  }, [config.pattern])

  const { getKeys } = useKeyScan(
    source.connection,
    source.database === undefined ? 0 : source.database,
    filter
  )

  const loadKeys = React.useCallback(
    async (reset: boolean = true) => {
      onKeyLoadBefore()
      const res = await getKeys(reset)
      if (reset) {
        setKeys(res.data.values.map(nameToItem))
      } else {
        setKeys((prev) => {
          return [...prev].concat(res.data.values.map(nameToItem))
        })
      }
      if (res.hasMore) {
        if (!stopSign.current) {
          loadKeys(false)
        } else {
          onKeyLoadStop()
          stopSign.current = false
        }
      } else {
        onKeyLoadAfter()
      }
    },
    [getKeys, onKeyLoadAfter, onKeyLoadBefore, onKeyLoadStop]
  )

  React.useImperativeHandle(ref, () => {
    return {
      loadKeys,
      stop() {
        stopSign.current = true
      }
    }
  })

  React.useEffect(() => {
    console.log(stopSign)
  }, [stopSign])

  return (
    <div>
      <Descriptions
        size="small"
        items={[
          {
            label: t('Total'),
            children: keys.length
          }
        ]}
      ></Descriptions>
      <div className="border h-[400px]">
        <VirtualList
          height={400}
          itemHeight={24}
          itemKey={(v) => v.name}
          data={keys}
        >
          {(item, index) => {
            return (
              <div className="h-[24px] border-b box-border flex items-center px-2">
                <div>{item.name}</div>
                <div></div>
              </div>
            )
          }}
        </VirtualList>
      </div>
    </div>
  )
}

export default React.forwardRef(Action)
