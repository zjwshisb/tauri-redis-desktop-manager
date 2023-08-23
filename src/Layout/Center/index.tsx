import React from 'react'
import { observer } from 'mobx-react-lite'
import { type ListRef } from 'rc-virtual-list'
import { Spin, Input, Space, Tooltip } from 'antd'
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
      setListHeight(container.clientHeight - 71 - 30)
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

  if (info == null) {
    return <></>
  }

  return (
    <ResizableDiv
      className={'h-screen border-r'}
      minWidth={200}
      defaultWidth={300}
      maxWidth={800}
    >
      <Spin spinning={loading}>
        <div
          className="flex flex-col h-screen overflow-hidden   bg-white"
          id={id}
        >
          <div className="py-2 px-2  bg-white flex item-center border-b">
            <Input
              prefix={<SearchOutlined />}
              placeholder={t('search').toString()}
              allowClear
              onChange={(e) => {
                onSearchChange.run(e.target.value)
              }}
            />
            <div className="flex-shrink-0 flex item-center px-2 justify-center">
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
                <Tooltip title={t('Refresh')}>
                  <ReloadOutlined
                    className="hover:cursor-pointer text-lg"
                    onClick={() => {
                      getKeys(true)
                    }}
                  />
                </Tooltip>
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
              </Space>
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
        </div>
      </Spin>
    </ResizableDiv>
  )
}

export default observer(Index)
