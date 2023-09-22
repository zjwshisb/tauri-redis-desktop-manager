import React from 'react'
import { observer } from 'mobx-react-lite'
import { type ListRef } from 'rc-virtual-list'
import {
  Spin,
  Input,
  Space,
  Tooltip,
  Statistic,
  ConfigProvider,
  Checkbox
} from 'antd'
import { useDebounceFn } from 'ahooks'
import useStore from '@/hooks/useStore'
import ResizableDiv from '@/components/ResizableDiv'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import List from './components/List'
import LoadMore from './components/LoadMore'
import Key from '@/components/Page/Key'
import TypeSelect from '@/components/TypeSelect'
import { getPageKey } from '@/utils'
import Add from './components/Add'
import Restore from './components/Restore'

import Editable from '@/components/Editable'
import useKeyScan, { type UseKeyScanFilter } from '@/hooks/useKeyScan'
import { type KeyInfo } from '@/store/key'

const Index: React.FC<{
  info: KeyInfo
}> = ({ info }) => {
  const store = useStore()

  const listRef = React.useRef<ListRef>(null)

  const id = React.useId()

  const [loading, setLoading] = React.useState(false)

  const [listHeight, setListHeight] = React.useState(0)

  const getListHeight = React.useCallback(() => {
    const container = document.getElementById(id)
    if (container != null) {
      console.log(container.clientHeight)
      setListHeight(container.clientHeight - 102 - 30)
    }
  }, [id])

  const getListHeightDb = useDebounceFn(getListHeight, {
    wait: 100
  })

  React.useEffect(() => {
    getListHeight()
  }, [getListHeight, info])

  React.useEffect(() => {
    window.addEventListener('resize', getListHeightDb.run)
    return () => {
      window.removeEventListener('resize', getListHeightDb.run)
    }
  }, [getListHeightDb])

  const { t } = useTranslation()

  const [params, setParams] = React.useState<UseKeyScanFilter>({
    types: '',
    search: ''
  })

  const onSearchChange = useDebounceFn((s: string) => {
    setParams((prev) => {
      return {
        ...prev,
        search: s
      }
    })
  })

  const [exactSearch, setExactSearch] = React.useState(false)

  const { keys, getKeys, more } = useKeyScan(info.connection, info.db, params, {
    beforeGet() {
      setLoading(true)
    },
    afterGet(reset: boolean) {
      if (reset) {
        listRef.current?.scrollTo(0)
      }
      setLoading(false)
    }
  })

  React.useEffect(() => {
    getKeys(true)
  }, [getKeys])

  React.useEffect(() => {
    if (exactSearch) {
      setParams((prev) => {
        let search = prev.search
        if (search.startsWith('*')) {
          search = search.substring(1)
        }
        if (search.endsWith('*')) {
          search = search.substring(0, search.length - 1)
        }
        return {
          ...prev,
          search
        }
      })
    } else {
      setParams((prev) => {
        if (prev.search.length > 0) {
          return {
            ...prev,
            search: `*${prev.search}*`
          }
        }
        return prev
      })
    }
  }, [exactSearch])

  return (
    <ResizableDiv
      className={'border-r'}
      minWidth={200}
      defaultWidth={300}
      maxWidth={800}
    >
      <div className="flex flex-col h-full overflow-hidden bg-white" id={id}>
        <Spin spinning={loading}>
          <div className="border-b">
            <div className="bg-[#ECECEC] p-2 flex justify-between items-center">
              <div>
                <Space className="flex">
                  <Editable connection={info.connection}>
                    <Add
                      onSuccess={(name: string) => {
                        const key = getPageKey(name, info.connection, info.db)
                        store.page.addPage({
                          key,
                          label: key,
                          type: 'key',
                          connection: info.connection,
                          name,
                          db: info.db,
                          children: (
                            <Key
                              name={name}
                              db={info.db}
                              connection={info.connection}
                              pageKey={key}
                            ></Key>
                          )
                        })
                      }}
                      info={info}
                    />
                  </Editable>
                  <Restore
                    info={info}
                    onSuccess={(name: string) => {
                      const key = getPageKey(name, info.connection, info.db)
                      store.page.addPage({
                        key,
                        label: key,
                        type: 'key',
                        connection: info.connection,
                        name,
                        db: info.db,
                        children: (
                          <Key
                            name={name}
                            db={info.db}
                            connection={info.connection}
                            pageKey={key}
                          ></Key>
                        )
                      })
                    }}
                  />
                  <Tooltip title={t('Refresh')} placement="bottom">
                    <ReloadOutlined
                      className="hover:cursor-pointer text-lg"
                      onClick={() => {
                        getKeys(true)
                      }}
                    />
                  </Tooltip>
                </Space>
              </div>
              <div>
                <ConfigProvider
                  theme={{
                    components: {
                      Statistic: {
                        contentFontSize: 14
                      }
                    }
                  }}
                >
                  <Statistic value={keys.length}></Statistic>
                </ConfigProvider>
              </div>
            </div>
            <div className="flex item-center p-2">
              <Input
                addonAfter={
                  <Tooltip title={t('Exact Search')} placement="bottom">
                    <Checkbox
                      checked={exactSearch}
                      onChange={(e) => {
                        setExactSearch(e.target.checked)
                      }}
                    />
                  </Tooltip>
                }
                prefix={<SearchOutlined />}
                placeholder={t('search').toString()}
                allowClear
                onChange={(e) => {
                  let v = e.target.value
                  if (!exactSearch) {
                    v = `*${v}*`
                  }
                  onSearchChange.run(v)
                }}
              />
              <div className="px-2">
                <Space>
                  <TypeSelect
                    className="w-28"
                    selectClassName="w-full"
                    value={params.types}
                    connection={info.connection}
                    onChange={(e) => {
                      setParams((prev) => {
                        return {
                          ...prev,
                          types: e
                        }
                      })
                    }}
                  />
                </Space>
              </div>
            </div>
          </div>
          <List info={info} keys={keys} height={listHeight} listRef={listRef} />
          <LoadMore
            disabled={!more}
            loading={loading}
            onClick={() => {
              getKeys()
            }}
          />
        </Spin>
      </div>
    </ResizableDiv>
  )
}

export default observer(Index)
