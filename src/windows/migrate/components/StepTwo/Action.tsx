import React from 'react'

import 'mac-scrollbar/dist/mac-scrollbar.css'

import useKeyScan from '@/hooks/useKeyScan'
import VirtualList, { type ListRef } from 'rc-virtual-list'
import { Alert, Descriptions, Empty, Progress, Spin, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { ceil, chunk } from 'lodash'
import request from '@/utils/request'
import classNames from 'classnames'

type Status = 'before' | 'finished' | 'stop'

interface ActionProps {
  onKeyLoadChange: (s: Status) => void
  onMigrateChange: (s: Status) => void
  loading: boolean
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
  migrate: () => void
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
  { source, target, config, onKeyLoadChange, onMigrateChange, loading },
  ref
) => {
  const { t } = useTranslation()

  const [keys, setKeys] = React.useState<KeyItem[]>([])

  const [successCount, setSuccessCount] = React.useState(0)
  const [failedCount, setFailedCount] = React.useState(0)

  const stopSign = React.useRef(false)

  const [percent, setPercent] = React.useState(0)
  const [err, setErr] = React.useState('')

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

  const resetProgress = React.useCallback(() => {
    setPercent(0)
    setFailedCount(0)
    setSuccessCount(0)
    setErr('')
  }, [])

  const loadKeys = React.useCallback(
    async (r: boolean = true) => {
      onKeyLoadChange('before')
      const res = await getKeys(r)
      resetProgress()
      if (r) {
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
          onKeyLoadChange('stop')
          stopSign.current = false
        }
      } else {
        onKeyLoadChange('finished')
      }
    },
    [getKeys, onKeyLoadChange, resetProgress]
  )

  const list = React.useRef<ListRef>(null)

  const migrate = React.useCallback(async () => {
    if (keys.length <= 0) {
      message.error(t('No Keys'))
      return
    }
    onMigrateChange('before')
    resetProgress()
    const group = chunk(keys, 100)
    let index = 0
    for (const x of group) {
      if (stopSign.current) {
        onMigrateChange('stop')
        return
      }
      try {
        const res = await request<
          Array<{
            name: string
            success: boolean
            message: string
          }>
        >('migrate', source.connection.id, {
          source_db: source.database,
          target_id: target.connection.id,
          target_db: target.database,
          keys: x.map((v) => v.name),
          delete: config.delete,
          replace: config.replace
        })
        setKeys((prev) => {
          const newState = [...prev]
          let sCount = 0
          let fCount = 0
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].success) {
              sCount += 1
            } else {
              fCount += 1
            }
            newState[i + index] = {
              name: newState[i].name,
              message: res.data[i].message,
              status: res.data[i].success ? 'success' : 'failed'
            }
          }
          setSuccessCount((p) => p + sCount)
          setFailedCount((p) => p + fCount)
          return newState
        })
        index += res.data.length
        list.current?.scrollTo({
          index: index - 10
        })
        setPercent(ceil(((index + 1) / keys.length) * 100, 2))
      } catch (e) {
        setErr(e as string)
        onMigrateChange('stop')
        return
      }
    }
    onMigrateChange('finished')
  }, [
    keys,
    onMigrateChange,
    resetProgress,
    t,
    source.connection.id,
    source.database,
    target.connection.id,
    target.database,
    config.delete,
    config.replace
  ])

  React.useImperativeHandle(ref, () => {
    return {
      loadKeys,
      migrate,
      stop() {
        stopSign.current = true
      }
    }
  })

  return (
    <div>
      <div className="border h-[300px]">
        {keys.length === 0 && (
          <div className={'h-full flex items-center justify-center'}>
            <Empty />
          </div>
        )}
        {keys.length !== 0 && (
          <Spin spinning={loading}>
            <VirtualList
              ref={list}
              height={300}
              itemHeight={24}
              itemKey={(v) => v.name}
              data={keys}
            >
              {(item, index) => {
                return (
                  <div className="h-[24px] border-b box-border flex items-center px-2">
                    <div className="w-[100px] flex-shrink-0">{index + 1}</div>
                    <div className="w-[300px] truncate break-all px-2 flex-1">
                      {item.name}
                    </div>
                    <div
                      className={classNames(
                        'w-[300px] flex-shrink-0 truncate break-words',
                        item.status === 'success'
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {item.message}
                    </div>
                  </div>
                )
              }}
            </VirtualList>
          </Spin>
        )}
      </div>
      <div className="mt-2">
        <Descriptions
          size="small"
          column={3}
          items={[
            {
              label: t('Total Count'),
              children: keys.length
            },
            {
              label: t('Success Count'),
              children: successCount
            },
            {
              label: t('Failed Count'),
              children: failedCount
            },
            {
              span: 3,
              label: t('Process'),
              children: <Progress percent={percent}></Progress>
            }
          ]}
        ></Descriptions>
      </div>

      {err !== '' && (
        <div className="mt-2">
          <Alert message={err} type="error"></Alert>
        </div>
      )}
    </div>
  )
}

export default React.forwardRef(Action)
