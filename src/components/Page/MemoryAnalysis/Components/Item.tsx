import React from 'react'
import { type KeyItem } from '..'
import { getPageKey, memoryFormat, openPage } from '@/utils'
import Key from '@/components/Page/Key'

interface ItemProps {
  item: KeyItem
  index: number
  connection: APP.Connection
  db: number
}
const Item = (props: ItemProps, ref: any) => {
  return (
    <div
      onClick={() => {
        const key = getPageKey(props.item.name, props.connection, props.db)
        openPage({
          key,
          label: key,
          connection: props.connection,
          name: props.item.name,
          db: props.db,
          type: 'key',
          children: (
            <Key
              name={props.item.name}
              db={props.db}
              connection={props.connection}
              pageKey={key}
            ></Key>
          )
        })
      }}
      className="flex px-2 h-[25px] justify-between items-center border-b  hover:cursor-pointer hover:bg-gray-100 last:border-b-0"
    >
      <div className="flex overflow-hidden">
        <div className="w-20 flex-shrink-0">{props.index}.</div>
        <div className="truncate">{props.item.name}</div>
      </div>
      <div className="ml-4 w-[100px] flex-shrink-0 text-right">
        {memoryFormat(props.item.memory)}
      </div>
    </div>
  )
}
export default React.forwardRef<any, ItemProps>(Item)
