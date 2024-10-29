import React from 'react'
import { observer } from 'mobx-react-lite'
import { type ListRef } from 'rc-virtual-list'
import { Spin, Statistic, ConfigProvider } from 'antd'
import { useDebounceFn } from 'ahooks'
import useStore from '@/hooks/useStore'
import ResizableDiv from '@/components/ResizableDiv'
import {
  ReloadOutlined,
  WindowsOutlined
} from '@ant-design/icons'
import VirtualKeyList from './components/VirtualKeyList'
import LoadMore from '@/components/LoadMore'
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
import CusButton from '@/components/CusButton'
import request from '@/utils/request'
import { Icon } from '@iconify/react'

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
      setListHeight(container.clientHeight - 102 - 33)
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
  }, [getListHeightDb.run])

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
    getKeys(true).then()
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
                        store.page.addPage({
                          type: 'key',
                          connection: info.connection,
                          name,
                          db: info.db
                        })
                      }}
                      info={info}
                    />
                  </Editable>
                  <CusButton
                    onClick={() => {
                      request<string>('key/randomkey', info.connection.id, {
                        db: info.db
                      }).then((res) => {
                        store.page.addPage({
                          type: 'key',
                          name: res.data,
                          connection: info.connection
                        })
                      })
                    }}
                    tooltip={{
                      title: 'Random Key'
                    }}
                    icon={<Icon icon={'mingcute:random-line'} fontSize={18} />}
                  ></CusButton>
                  <Editable connection={info.connection}>
                    <Restore
                      info={info}
                      onSuccess={(name: string) => {
                        store.page.addPage({
                          type: 'key',
                          connection: info.connection,
                          name,
                          db: info.db
                        })
                      }}
                    />
                  </Editable>
                  {isMain && (
                    <CusButton
                      onClick={() => {
                        store.keyInfo.newWindow(info.connection, info.db)
                      }}
                      icon={
                        <WindowsOutlined className="text-lg"></WindowsOutlined>
                      }
                      tooltip={{
                        title: 'Open In New Window'
                      }}
                    ></CusButton>
                  )}
                  <CusButton
                    tooltip={{
                      title: 'Refresh'
                    }}
                    onClick={() => {
                      getKeys(true).then()
                    }}
                    icon={<ReloadOutlined className="text-lg" />}
                  ></CusButton>
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
                      prefix={
                        <Icon
                          icon={'fluent:key-multiple-16-regular'}
                          fontSize={14}
                        />
                      }
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
                  getKeys().then()
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
