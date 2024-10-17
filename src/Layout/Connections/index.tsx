import React from 'react'
import Connection from '@/components/Connection'
import { observer } from 'mobx-react-lite'
import ResizableDiv from '@/components/ResizableDiv'
import useStore from '@/hooks/useStore'
import { MacScrollbar } from 'mac-scrollbar'
import Container from '@/components/Container'

const Index: React.FC = () => {
  const store = useStore()

  return (
    <ResizableDiv
      className={
        'border-r border-neutral-border dark:border-neutral-border-dark'
      }
      minWidth={200}
      defaultWidth={300}
      maxWidth={500}
    >
      <Container
        className="flex h-full flex-col overflow-hidden"
        level={2}
        id="connection"
      >
        <MacScrollbar>
          <div>
            {store.connection.connections.map((v) => {
              return <Connection connection={v} key={v.id}></Connection>
            })}
          </div>
        </MacScrollbar>
      </Container>
    </ResizableDiv>
  )
}
export default observer(Index)
