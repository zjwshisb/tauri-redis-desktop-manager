import React from 'react'
import { observer } from 'mobx-react-lite'
import useStore from '@/hooks/useStore'
import { Tabs } from 'antd'
import Setting from '../Setting'
import FieldView from '../FieldView'

const Index: React.FC = () => {
  const store = useStore()

  return <div className={'flex-1 h-screen bg-white p-2 pb-20 box-border overflow-x-auto'}>
    <FieldView />
   <Setting />
   <Tabs
      hideAdd
      onEdit={(targetKey, action) => {
        if (action === 'remove') {
          store.page.removePage(targetKey as string)
        }
      }}
      onTabClick={e => {
        store.page.switch(e)
      }}
      type="editable-card"
      activeKey={store.page.active}
      items={store.page.pages.map(v => {
        return {
          label: v.label,
          key: v.key,
          children: v.children
        }
      })}
    />
  </div>
}

export default observer(Index)
