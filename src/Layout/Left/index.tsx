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
          {/* <div className="flex items-center p-2 flex-shrink-0">
            <div className="flex-1">
              <Button
                size="large"
                block
                icon={<PlusOutlined />}
                onClick={() => {
                  store.connection.openForm()
                }}
              >
                {t('New Connection')}
              </Button>
            </div>
            <div className="ml-2 flex-shrink-0">
              <Setting />
            </div>
            <div className="ml-2 flex-shrink-0">
              <DeBug />
            </div>
          </div> */}
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
