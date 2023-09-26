import React from 'react'
import { Card } from 'antd'
import FieldViewer from '@/components/FieldViewer'
import Edit from './components/Edit'

import ValueLayout from '../ValueLayout'

const Index: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [value, setValue] = React.useState(keys.data)

  React.useEffect(() => {
    setValue(keys.data)
  }, [keys.data])

  return (
    <ValueLayout actions={<Edit keys={keys} onSuccess={onRefresh} />}>
      <Card bodyStyle={{ padding: 8 }}>
        <FieldViewer content={value}></FieldViewer>
      </Card>
    </ValueLayout>
  )
}
export default Index
