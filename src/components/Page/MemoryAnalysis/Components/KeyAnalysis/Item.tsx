import React from 'react'
import { type KeyItem } from './index'
import { memoryFormat } from '@/utils'
import Key from '@/components/Page/Key'
import useStore from '@/hooks/useStore'
import InteractiveContainer from '@/components/InteractiveContainer'

interface ItemProps {
  item: KeyItem
  index: number
  connection: APP.Connection
  db: number
}
const Item: React.FC<ItemProps> = (props) => {
  const store = useStore()
  return (
    <InteractiveContainer
      onClick={() => {
        const page = store.page.createPage(
          {
            connection: props.connection,
            name: props.item.name,
            db: props.db,
            type: 'key'
          },
          ({ key }) => (
            <Key
              name={props.item.name}
              db={props.db}
              connection={props.connection}
              pageKey={key}
            ></Key>
          )
        )
        store.page.openPage(page)
      }}
      className="flex px-2 h-[25px] justify-between items-center border-b-[0.5px] last:border-b-0"
    >
      <div className="w-40 flex-shrink-0">{props.index}.</div>
      <div className="flex flex-1 overflow-hidden">
        <div className="truncate flex-1">{props.item.name}</div>
        <div className="ml-10 w-[100ox] flex-shrink-0">{props.item.types}</div>
      </div>
      <div className="ml-4 w-[100px] flex-shrink-0 text-right">
        {memoryFormat(props.item.memory)}
      </div>
    </InteractiveContainer>
  )
}
export default Item
