import React from 'react'
import { Card } from 'antd'
import FieldViewer from '@/components/FieldViewer'
import ValueLayout from '../ValueLayout'

import Set from './components/Set'
import DecrBy from './components/DecrBy'
import Decr from './components/Decr'
import GetRange from './components/GetRange'
import Incr from './components/Incr'
import IncrBy from './components/IncrBy'
import IncrByFloat from './components/IncrByFloat'
import SetRange from './components/SetRange'
import Append from './components/Append'
import Lcs from './components/Lcs'
import MGet from './components/MGet'
import GetDel from './components/GetDel'

const StringValue: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  return (
    <ValueLayout
      readonlyAction={
        <>
          <MGet keys={keys} />
          <GetRange keys={keys} />
          <Lcs keys={keys} />
        </>
      }
      actions={
        <>
          <GetDel keys={keys} onRefresh={onRefresh}></GetDel>
          <Set keys={keys} onRefresh={onRefresh} />
          <SetRange keys={keys} onRefresh={onRefresh} />
          <Append keys={keys} onRefresh={onRefresh} />
          <Incr keys={keys} onRefresh={onRefresh} />
          <IncrBy keys={keys} onRefresh={onRefresh} />
          <IncrByFloat keys={keys} onRefresh={onRefresh} />
          <Decr keys={keys} onRefresh={onRefresh} />
          <DecrBy keys={keys} onRefresh={onRefresh} />
        </>
      }
    >
      <Card bodyStyle={{ padding: 8 }}>
        <FieldViewer content={keys.data}></FieldViewer>
      </Card>
    </ValueLayout>
  )
}
export default StringValue
