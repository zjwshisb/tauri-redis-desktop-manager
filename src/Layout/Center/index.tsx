import React from 'react'
import { observer } from 'mobx-react-lite'
import { type ListRef } from 'rc-virtual-list'
import { Spin } from 'antd'
import { useDebounceFn } from 'ahooks'
import useStore from '@/hooks/useStore'
import ResizableDiv from '@/components/ResizableDiv'
import Request from './components/Request'

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
      defaultWidth={300}
      maxWidth={800}
    >
      <Spin spinning={loading}>
        <div
          className="flex flex-col h-screen overflow-hidden   bg-white"
          id={id}
        >
          <Request
            keyInfo={info}
            onLoadingChange={setLoading}
            loading={loading}
            listHeight={listHeight}
            listRef={listRef}
          />
        </div>
      </Spin>
    </ResizableDiv>
  )
}

export default observer(Index)
