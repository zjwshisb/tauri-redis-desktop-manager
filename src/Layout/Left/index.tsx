import React from 'react'
import Connection from '@/components/Connection'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import ResizableDiv from '@/components/ResizableDiv'
import Setting from '@/components/Setting'
import useStore from '@/hooks/useStore'
import ConnectionForm from '@/components/ConnectionForm'
import { PlusOutlined } from '@ant-design/icons'
import Log from '@/components/Log'

const Index: React.FC = () => {
  const store = useStore()

  const { t } = useTranslation()

  React.useEffect(() => {
    store.connection.fetchConnections()
  }, [store.connection])

  return (
    <ResizableDiv
      className={'h-screen border-r'}
      minWidth={200}
      defaultWidth={300}
      maxWidth={500}
    >
      <div className="h-full overflow-y-auto bg-white pb-10" id="connection">
        <div className="flex items-center p-2">
          <div className="flex-1">
            <ConnectionForm
              trigger={
                <Button size="large" block icon={<PlusOutlined />}>
                  {t('New Connection')}
                </Button>
              }
              onSuccess={() => {
                store.connection.fetchConnections()
              }}
            ></ConnectionForm>
          </div>
          <div className="ml-2 flex-shrink-0">
            <Setting />
          </div>
          <div className="ml-2 flex-shrink-0">
            <Log />
          </div>
        </div>

        <div className={''}>
          {store.connection.connections.map((v) => {
            return <Connection connection={v} key={v.id}></Connection>
          })}
        </div>
      </div>
    </ResizableDiv>
  )
}
export default observer(Index)
