import React from 'react'
import { type KeyItem } from '..'

const Item: React.FC<{
  item: KeyItem
  connection: APP.Connection
  db: number
}> = ({ item }) => {
  return (
    <div>
      {item.name}
      {item.memory}
    </div>
  )
}
export default Item
