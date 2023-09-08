import React from 'react'
import { Card } from 'antd'
import FieldViewer from '@/components/FieldViewer'
import Edit from './components/Edit'
import context from '../../context'
import Editable from '@/components/Editable'

const Index: React.FC<{
  keys: APP.StringKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const [value, setValue] = React.useState(keys.data)

  const connection = React.useContext(context)

  React.useEffect(() => {
    setValue(keys.data)
  }, [keys.data])

  return (
    <div>
      <div className="pb-2 flex items-center">
        <Editable connection={connection}>
          <Edit keys={keys} onSuccess={onRefresh} />
        </Editable>
      </div>
      <Card bodyStyle={{ padding: 8 }}>
        <FieldViewer content={value}></FieldViewer>
      </Card>
    </div>
  )
}
export default Index
