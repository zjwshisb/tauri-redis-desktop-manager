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
import GetSet from './components/GetSet'
import MSet from './components/MSet'

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
          <GetSet keys={keys} onSuccess={onRefresh} />
          <GetDel keys={keys} onSuccess={onRefresh}></GetDel>
          <MSet keys={keys} onSuccess={onRefresh}></MSet>
          <Set keys={keys} onSuccess={onRefresh} />
          <SetRange keys={keys} onSuccess={onRefresh} />
          <Append keys={keys} onSuccess={onRefresh} />
          <Incr keys={keys} onSuccess={onRefresh} />
          <IncrBy keys={keys} onSuccess={onRefresh} />
          <IncrByFloat keys={keys} onSuccess={onRefresh} />
          <Decr keys={keys} onSuccess={onRefresh} />
          <DecrBy keys={keys} onSuccess={onRefresh} />
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
