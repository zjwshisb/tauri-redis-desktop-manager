import React from 'react'
import Page from '..'
import useStore from '@/hooks/useStore'
import InteractiveContainer from '@/components/InteractiveContainer'
import { observer } from 'mobx-react-lite'
import { Empty } from 'antd'
import { DeleteRowOutlined } from '@ant-design/icons'
import Container from '@/components/Container'
import { type Page as PageInterface } from '@/store/page'
import CusButton from '@/components/CusButton'

const Collection: React.FC<{
  pageKey: string
}> = ({ pageKey }) => {
  const store = useStore()

  return (
    <Page pageKey={pageKey} collected={false} noPadding={true}>
      <div>
        {store.collection.items.length === 0 && (
          <div className="mt-20">
            <Empty />
          </div>
        )}
        {store.collection.items.map((v, index) => {
          return (
            <Container
              key={v.id}
              level={index % 2 === 0 ? 4 : 3}
              onClick={async (e) => {
                e.stopPropagation()
                const connection = store.connection.connections.find(
                  (c) => c.id === v.connection_id
                )
                if (connection !== undefined && connection.open !== true) {
                  store.connection.open(connection.id)
                }
                store.page.addPageOrInNewWindow({
                  name: v.name,
                  db: v.db,
                  type: v.types as PageInterface['type'],
                  connection
                })
              }}
            >
              <InteractiveContainer className="flex items-center py-1">
                <div className="px-4 min-w-[100px]">#{v.connection_id}</div>
                <div className="px-4  flex-1">{v.name}</div>
                <div className="px-4 w-28">
                  <CusButton
                    danger
                    icon={<DeleteRowOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      store.collection.removeByPageKey(v.key)
                    }}
                  ></CusButton>
                </div>
              </InteractiveContainer>
            </Container>
          )
        })}
      </div>
    </Page>
  )
}
export default observer(Collection)
