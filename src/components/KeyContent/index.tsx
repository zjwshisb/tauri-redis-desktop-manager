import React from 'react'
import { observer } from 'mobx-react-lite'
import { Resizable } from 're-resizable'
import useStore from '../../hooks/useStore'
import { Tabs } from 'antd'
import KeyList from '../KeyList'

const Index: React.FC = () => {
  const store = useStore()

  const [width, setWidth] = React.useState(250)

  if (store.db.db.length <= 0) {
    return <></>
  }

  return <Resizable
    className={'h-screen border-r'}
    minWidth={'200px'}
    onResizeStop={(e, direction, ref, d) => {
      setWidth(p => p + d.width)
    }}
    enable={{
      right: true
    }}
   size={{
     width
   }}>
    {
      store.db.db.length === 1
        ? <KeyList db={store.db.db[0]} />
        : <Tabs
      className={'h-screen'}
      onTabClick={e => {
        store.db.switch(e)
      }}
      onEdit={(e, action) => {
        if (action === 'remove') {
          store.db.remove(e as string)
        }
      }}
      activeKey={store.db.active}
      tabPosition='left'
      hideAdd
      type='editable-card'
      items={store.db.db.map(v => {
        const name = v.connection.host + '@' + v.db.toString()
        return {
          label: name,
          key: v.key,
          children: <KeyList db={v}></KeyList>
        }
      })}>

    </Tabs>
    }

  </Resizable>
}

export default observer(Index)
