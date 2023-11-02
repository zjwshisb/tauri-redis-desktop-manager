import React from 'react'
import { observer } from 'mobx-react-lite'
import { type ListRef } from 'rc-virtual-list'
import { Spin, Tooltip, Statistic, ConfigProvider, Button } from 'antd'
import { useDebounceFn } from 'ahooks'
import useStore from '@/hooks/useStore'
import ResizableDiv from '@/components/ResizableDiv'
import { ReloadOutlined, KeyOutlined, WindowsOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import VirtualKeyList from './components/VirtualKeyList'
import LoadMore from '@/components/LoadMore'
import Key from '@/components/Page/Key'
import { isMainWindow } from '@/utils'
import Add from './components/Add'
import Restore from './components/Restore'
import Filter from './components/Filter'

import Editable from '@/components/Editable'
import useKeyScan from '@/hooks/useKeyScan'
import { type KeyInfo } from '@/store/key'
import Context from './context'
import reducer from './reducer'
import Container from '@/components/Container'

const isMain = isMainWindow()

const Index: React.FC<{
  info: KeyInfo
}> = ({ info }) => {
  const store = useStore()

  const listRef = React.useRef<ListRef>(null)

  const [state, dispatch] = React.useReducer(reducer, {
    filter: {
      types: '',
      search: '',
      exact: false
    }
  })

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

  const { keys, getAllKeys, getKeys, more } = useKeyScan(
    info.connection,
    info.db,
    state.filter,
    {
      beforeGet() {
        setLoading(true)
      },
      afterGet(reset: boolean) {
        if (reset) {
          listRef.current?.scrollTo(0)
        }
        setLoading(false)
      }
    }
  )

  React.useEffect(() => {
    getKeys(true)
  }, [getKeys])

  return (
    <ResizableDiv
      className={
        'border-r  border-neutral-border dark:border-neutral-border-dark'
      }
      minWidth={200}
      defaultWidth={300}
      maxWidth={800}
    >
      <Context.Provider value={[state, dispatch]}>
        <Container
          className="flex flex-col h-full overflow-hidden"
          id={id}
          level={3}
        >
          <Spin spinning={loading}>
            <Container className="border-b" level={5}>
              <Container
                className="p-2 flex justify-between items-center border-b"
                level={5}
              >
                <div className="flex">
                  <Editable connection={info.connection}>
                    <Add
                      onSuccess={(name: string) => {
                        store.page.addCreatePage(
                          {
                            type: 'key',
                            connection: info.connection,
                            name,
                            db: info.db
                          },
                          ({ key }) => (
                            <Key
                              name={name}
                              db={info.db}
                              connection={info.connection}
                              pageKey={key}
                            ></Key>
                          )
                        )
                      }}
                      info={info}
                    />
                  </Editable>
                  <Editable connection={info.connection}>
                    <Restore
                      info={info}
                      onSuccess={(name: string) => {
                        store.page.addCreatePage(
                          {
                            type: 'key',
                            connection: info.connection,
                            name,
                            db: info.db
                          },
                          ({ key }) => (
                            <Key
                              name={name}
                              db={info.db}
                              connection={info.connection}
                              pageKey={key}
                            ></Key>
                          )
                        )
                      }}
                    />
                  </Editable>
                  {isMain && (
                    <Tooltip title={t('Open In New Window')} placement="bottom">
                      <Button
                        size="small"
                        onClick={() => {
                          store.keyInfo.newWindow(info.connection, info.db)
                        }}
                        type="text"
                        icon={
                          <WindowsOutlined className="text-lg"></WindowsOutlined>
                        }
                      ></Button>
                    </Tooltip>
                  )}
                  <Tooltip title={t('Refresh')} placement="bottom">
                    <Button
                      size="small"
                      type="text"
                      onClick={() => {
                        getKeys(true)
                      }}
                      icon={<ReloadOutlined className="text-lg" />}
                    ></Button>
                  </Tooltip>
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
                    <Statistic
                      prefix={<KeyOutlined />}
                      value={keys.length}
                    ></Statistic>
                  </ConfigProvider>
                </div>
              </Container>
              <Filter connection={info.connection} />
            </Container>
            <VirtualKeyList
              info={info}
              keys={keys}
              height={listHeight}
              listRef={listRef}
            />
            <Container className="p-2 border-t">
              <LoadMore
                disabled={!more}
                loading={loading}
                onGetAll={getAllKeys}
                onGet={() => {
                  getKeys()
                }}
              />
            </Container>
          </Spin>
        </Container>
      </Context.Provider>
    </ResizableDiv>
  )
}

export default observer(Index)
