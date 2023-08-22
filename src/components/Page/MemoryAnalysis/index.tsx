import React from 'react'
import Item from './Components/Item'
import request from '@/utils/request'
import VirtualList from 'rc-virtual-list'
import { Button, Space, message, Statistic } from 'antd'
import { useTranslation } from 'react-i18next'
import { memoryFormat } from '@/utils'
import Filter, { type FilterForm } from './Components/Filter'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'

export interface KeyItem {
  name: string
  memory: number
}

const MemoryAnalysis: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const [form, setForm] = React.useState<FilterForm>({
    search: '',
    db: 0,
    types: ''
  })

  const formRef = React.useRef(form)
  formRef.current = form

  const cacheRef = React.useRef<FilterForm>(form)

  const [keys, setKeys] = React.useState<KeyItem[]>([])

  const [loading, setLoading] = React.useState(false)

  const [sort, setSort] = React.useState<'desc' | 'asc'>('desc')

  const [finished, setFinished] = React.useState(false)

  const stopSign = React.useRef(false)

  const { t } = useTranslation()

  const init = React.useRef(false)

  const cursor = React.useRef('0')

  const getData = React.useCallback(
    async (params: FilterForm) => {
      await request<{
        cursor: string
        keys: KeyItem[]
      }>('key/analysis', connection.id, {
        count: 100,
        cursor: cursor.current,
        ...params
      }).then((r) => {
        setKeys((prev) => {
          return [...prev].concat(r.data.keys)
        })
        cursor.current = r.data.cursor
        if (!stopSign.current) {
          if (r.data.cursor !== '0') {
            getData(params)
          } else {
            setFinished(true)
            setLoading(false)
          }
        } else {
          cacheRef.current = params
          setLoading(false)
        }
      })
    },
    [connection.id]
  )

  const analysis = React.useCallback(
    (params: FilterForm, reset: boolean = true) => {
      stopSign.current = false
      setFinished(false)
      setLoading(true)
      if (reset) {
        setKeys([])
      }
      getData(params)
    },
    [getData]
  )

  const stopAnalysis = React.useCallback(() => {
    stopSign.current = true
  }, [])

  const continueAnalysis = React.useCallback(() => {
    if (cursor.current === '0') {
      message.error('All Key Had Down')
    } else {
      analysis(cacheRef.current, false)
    }
  }, [analysis])

  React.useEffect(() => {
    if (!init.current) {
      init.current = true
      setLoading(true)
      getData(formRef.current)
    }
  }, [getData])

  const sortKeys = React.useMemo(() => {
    const number = sort === 'desc' ? -1 : 1
    return keys.sort((a, b) => {
      return a.memory > b.memory ? number : -number
    })
  }, [keys, sort])

  const icon = React.useMemo(() => {
    if (sort === 'desc') {
      return <CaretDownOutlined></CaretDownOutlined>
    } else {
      return <CaretUpOutlined />
    }
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
      <div className="border">
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
      </div>
    </div>
  )
}

export default MemoryAnalysis
