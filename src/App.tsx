import React from 'react'
import { observer } from 'mobx-react-lite'
import Right from './Layout/Right'
import Left from './Layout/Left'
import Center from './Layout/Center'

import AppLayout from './components/AppLayout'
import useStore from './hooks/useStore'

const App: React.FC = () => {
  const store = useStore()

  return (
    <AppLayout>
      <Left />
      {store.keyInfo.info != null && (
        <Center info={store.keyInfo.info}></Center>
      )}
      <Right />
    </AppLayout>
  )
}

export default observer(App)

function test(current: number, count: number, interval = 10) {
  const total = 10 * 8 + count
  setTimeout(() => {
    current += 1
    // 改变对应的样式
    console.log(current)
    if (current < total) {
      test(current, count, interval)
    }
  }, 100 + interval * current)
}
