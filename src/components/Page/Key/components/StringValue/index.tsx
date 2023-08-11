import React from 'react'
import { Card } from 'antd'
import FieldViewer from '@/components/FieldViewer'
import Edit from './components/Edit'

const Index: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [value, setValue] = React.useState(keys.data)

  React.useEffect(() => {
    setValue(keys.data)
  }, [keys.data])

  return (
    <div>
      <div className="pb-2 flex items-center">
        <Edit keys={keys} onSuccess={onRefresh} />
      </div>
      <Card bodyStyle={{ padding: 16 }}>
        <FieldViewer content={value}></FieldViewer>
      </Card>
    </div>
  )
}
export default Index
