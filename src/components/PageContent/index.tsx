import React from 'react'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Tabs, Tooltip } from 'antd'
import Setting from '../Setting'
import FieldView from '../FieldView'

const Index: React.FC = () => {
  const store = useStore()

  return (
    <div
      className={
        'flex-1 h-screen bg-white p-2 pb-20 box-border overflow-x-hidden'
      }
    >
      <FieldView />
      <Setting />
      {store.page.pages.length === 0 && <div>222</div>}
      {store.page.pages.length > 0 && (
        <Tabs
          size="small"
          hideAdd
          onEdit={(targetKey, action) => {
            if (action === 'remove') {
              store.page.removePage(targetKey as string)
            }
          }}
          onTabClick={(e) => {
            store.page.switch(e)
          }}
          type="editable-card"
          activeKey={store.page.active}
          items={store.page.pages.map((v) => {
            return {
              label: (
                <Tooltip title={v.label} mouseEnterDelay={0.6}>
                  <div className="max-w-xs truncate">{v.label}</div>
                </Tooltip>
              ),
              key: v.key,
              children: v.children
            }
          })}
        />
      )}
    </div>
  )
}

export default observer(Index)
