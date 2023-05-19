import React from 'react'
import { Input } from 'antd'

const Index: React.FC<{
  item: APP.StringKey
}> = ({ item }) => {
  return <div>
      <Input.TextArea value={item.data} rows={4}></Input.TextArea>
    </div>
}
export default Index
