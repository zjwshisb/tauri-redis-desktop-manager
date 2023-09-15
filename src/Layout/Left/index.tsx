import React from 'react'
import Connection from '@/components/Connection'
import { observer } from 'mobx-react-lite'
import ResizableDiv from '@/components/ResizableDiv'
import useStore from '@/hooks/useStore'
import { MacScrollbar } from 'mac-scrollbar'

const Index: React.FC = () => {
  const store = useStore()

  return (
    <>
      <ResizableDiv
        className={'border-r'}
        minWidth={200}
        defaultWidth={300}
        maxWidth={500}
      >
        <div
          className="flex h-full  bg-[#E7E8E8] flex-col overflow-hidden"
          id="connection"
        >
          <MacScrollbar>
            <div>
              {store.connection.connections.map((v) => {
                return <Connection connection={v} key={v.id}></Connection>
              })}
            </div>
          </MacScrollbar>
        </div>
      </ResizableDiv>
    </>
  )
}
export default observer(Index)
