import React from 'react'
import Item from './Item'
import request from '@/utils/request'
import VirtualList from 'rc-virtual-list'
import { Button, Space, message, Statistic, InputNumber, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { memoryFormat } from '@/utils'
import Filter, { type FilterForm } from './Filter'
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons'
import { useScanCursor } from '@/hooks/useKeyScan'
import classNames from 'classnames'
import useStore from '@/hooks/useStore'
import Container from '@/components/Container'

export interface KeyItem {
  name: string
  memory: number
  types: string
}

const KeyAnalysis: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const [form, setForm] = React.useState<FilterForm>({
    search: '',
    db: 0,
    types: ''
  })

  const formRef = React.useRef(form)
  formRef.current = form

  const { cursor, isMore, resetCursor, setCursor, isInit } =
    useScanCursor<KeyItem>(connection)

  const cacheRef = React.useRef<FilterForm>(form)

  const [keys, setKeys] = React.useState<KeyItem[]>([])

  const [size, setSize] = React.useState<number | null>(null)

  const [loading, setLoading] = React.useState(false)

  const [sort, setSort] = React.useState<'desc' | 'asc'>('desc')

  const [finished, setFinished] = React.useState(false)

  const stopSign = React.useRef(false)

  const { t } = useTranslation()

  const store = useStore()

  const getData = React.useCallback(
    async (params: FilterForm) => {
      let path = 'memory/analysis'
      if (connection.is_cluster) {
        path = 'cluster/analysis'
      }
      await request<APP.ScanLikeResp<KeyItem>>(path, connection.id, {
        count: store.setting.setting.key_count,
        cursor: cursor.current,
        ...params
      }).then((r) => {
        setKeys((prev) => {
          return [...prev].concat(r.data.values)
        })
        setCursor(r.data)
        if (stopSign.current) {
          cacheRef.current = params
          setLoading(false)
        } else {
          if (isMore(r.data)) {
            getData(params)
          } else {
            setFinished(true)
            setLoading(false)
          }
        }
      })
    },
    [
      connection.id,
      connection.is_cluster,
      cursor,
      isMore,
      setCursor,
      store.setting.setting.key_count
    ]
  )

  const analysis = React.useCallback(
    (params: FilterForm, reset: boolean = true) => {
      stopSign.current = false
      setFinished(false)
      setLoading(true)
      if (reset) {
        resetCursor()
        setKeys([])
      }
      getData(params)
    },
    [getData, resetCursor]
  )

  const stopAnalysis = React.useCallback(() => {
    stopSign.current = true
  }, [])

  const continueAnalysis = React.useCallback(() => {
    if (isInit()) {
      message.error('All Key Had Down')
    } else {
      analysis(cacheRef.current, false)
    }
  }, [analysis, isInit])

  const sortKeys = React.useMemo(() => {
    const number = sort === 'desc' ? -1 : 1
    let r = keys
    if (size !== null && size > 0) {
      r = keys.filter((v) => {
        return v.memory >= size
      })
    }
    return r.sort((a, b) => {
      return a.memory > b.memory ? number : -number
    })
  }, [keys, size, sort])

  const icon = React.useMemo(() => {
    return (
      <div className="flex flex-col justify-center h-[10px] text-[12px]">
        <CaretUpFilled
          size={10}
          className={classNames([sort === 'asc' && 'text-blue-600'])}
          color={sort === 'asc' ? '#1677ff' : undefined}
        />
        <CaretDownFilled
          size={10}
          className={classNames([
            'mt-[-0.2rem]',
            sort === 'desc' && 'text-blue-600'
          ])}
        />
      </div>
    )
  }, [sort])

  return (
    <div>
      <div className="flex">
        <Filter value={form} onValueChange={setForm} connection={connection} />
        <div className="mb-2 mr-2">
          <Space>
            <Button
              loading={loading}
              type="primary"
              disabled={loading}
              onClick={() => {
                analysis(formRef.current, true)
              }}
            >
              {t('Analysis')}
            </Button>
            {loading && !finished && (
              <Button onClick={stopAnalysis}>{t('Suspend')}</Button>
            )}
            {!loading && !finished && (
              <Button onClick={continueAnalysis}>{t('Continue')}</Button>
            )}
          </Space>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="flex">
            <div className="mr-10">
              <Statistic
                title={t('Total Amount')}
                value={keys.length}
              ></Statistic>
            </div>
            <div className="mr-10">
              <Statistic
                title={t('Total Memory')}
                formatter={(v) => {
                  return memoryFormat(v as number)
                }}
                value={keys.reduce((a, b) => {
                  return a + b.memory
                }, 0)}
              ></Statistic>
            </div>
          </div>
        </div>
        <div className="self-end flex-shrink-0 ml-10">
          <div className="flex items-center">
            <InputNumber
              onChange={(e) => {
                setSize(e as number)
              }}
              className="mr-2"
              size="small"
              addonAfter="Bytes"
              placeholder={t('Minimum Size').toString()}
            />
            <div
              className="w-10 h-10 flex items-center justify-center hover:cursor-pointer"
              onClick={() => {
                setSort((p) => {
                  return p === 'asc' ? 'desc' : 'asc'
                })
              }}
            >
              {icon}
            </div>
          </div>
        </div>
      </div>
      <Container className="border rounded overflow-hidden">
        {keys.length === 0 && (
          <div className="h-[600px]">
            <Empty className="py-10"></Empty>
          </div>
        )}
        {keys.length !== 0 && (
          <VirtualList
            height={600}
            itemHeight={25}
            data={sortKeys}
            itemKey={(v) => v.name}
          >
            {(v, index) => {
              return (
                <Item
                  connection={connection}
                  db={form.db}
                  key={v.name}
                  item={v}
                  index={index + 1}
                ></Item>
              )
            }}
          </VirtualList>
        )}
      </Container>
    </div>
  )
}

export default KeyAnalysis
