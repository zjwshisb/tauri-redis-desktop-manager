import React from 'react'
import { observer } from 'mobx-react-lite'
import { type ListRef } from 'rc-virtual-list'
import { Spin } from 'antd'
import { useDebounceFn } from 'ahooks'
import Key from '@/components/Page/Key'
import useStore from '@/hooks/useStore'
import Add from './components/Add'
import ResizableDiv from '@/components/ResizableDiv'
import { getPageKey } from '@/utils'
import Single from './components/Single'

const Index: React.FC = () => {
  const store = useStore()

  const listRef = React.useRef<ListRef>(null)

  const id = React.useId()

  const info = React.useMemo(() => {
    return store.keyInfo.info
  }, [store.keyInfo.info])

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

  if (info == null) {
    return <></>
  }

  return (
    <ResizableDiv
      className={'h-screen border-r'}
      minWidth={200}
      defaultWidth={250}
      maxWidth={500}
    >
      <Spin spinning={loading}>
        <div
          className="flex flex-col h-screen overflow-hidden   bg-white"
          id={id}
        >
          <Single
            keyInfo={info}
            onLoadingChange={setLoading}
            loading={loading}
            listHeight={listHeight}
            listRef={listRef}
            add={
              <Add
                onSuccess={(name: string) => {
                  const key = getPageKey(name, info.connection, info.db)
                  store.page.addPage({
                    key,
                    label: key,
                    connectionId: info.connection.id,
                    children: (
                      <Key
                        name={name}
                        db={info.db as number}
                        connection={info.connection}
                        pageKey={key}
                      ></Key>
                    )
                  })
                }}
                info={info}
              />
            }
          />
        </div>
      </Spin>
    </ResizableDiv>
  )
}

export default observer(Index)
