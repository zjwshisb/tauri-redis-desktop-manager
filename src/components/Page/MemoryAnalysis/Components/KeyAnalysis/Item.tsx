import React from 'react'
import { type KeyItem } from './index'
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
      className="flex px-2 h-[25px] justify-between items-center border-b last:border-b-0 active-able"
    >
      <div className="w-40 flex-shrink-0">{props.index}.</div>
      <div className="flex flex-1 overflow-hidden">
        <div className="truncate flex-1">{props.item.name}</div>
        <div className="ml-10 w-[100ox] flex-shrink-0">{props.item.types}</div>
      </div>
      <div className="ml-4 w-[100px] flex-shrink-0 text-right">
        {memoryFormat(props.item.memory)}
      </div>
    </div>
  )
}
export default React.forwardRef<any, ItemProps>(Item)
