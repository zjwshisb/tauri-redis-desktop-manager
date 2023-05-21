import React from 'react'
import { observer } from 'mobx-react-lite'
import useStore from '../../hooks/useStore'
import { Tabs } from 'antd'
import Key from '../Page/Key'
import Setting from '../Setting'
import useRequest from '../../hooks/useRequest'
import FieldView from '../FieldView'

const Index: React.FC = () => {
  const store = useStore()

  const { data } = useRequest<APP.Key>('key/get', 11, {
    key: 'book_test_cache:live:token'
  })

  const items = React.useMemo(() => {
    if (data != null) {
      return [{
        label: 'new_test_database_query:2023-05-18',
        key: 'new_test_database_query:2023-05-18',
        children: <Key item={data}></Key>
      }]
    }
    return []
  }, [data])

  // if (store.page.pages.length === 0) {
  //   return <div>
  //     222
  //   </div>
  // }

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
      // activeKey={store.page.active}
      accessKey='new_test_database_query:2023-05-18'
      items={items}
      // items={store.page.pages.map(v => {
      //   return {
      //     label: v.label,
      //     key: v.key,
      //     children: v.children
      //   }
      // })}
    />
  </div>
}

export default observer(Index)
