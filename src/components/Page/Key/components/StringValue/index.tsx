import React from 'react'
import { Input } from 'antd'

const Index: React.FC<{
  value: string
}> = ({ value }) => {
  return (
    <div>
      <Input.TextArea value={value} rows={4}></Input.TextArea>
    </div>
  )
}
export default Index
