import React from 'react'
import VirtualList, { type ListRef } from 'rc-virtual-list'
import { Empty, List } from 'antd'
import { type KeyInfo } from '@/store/key'
import KeyItem from './KeyItem'

const VirtualKeyList: React.FC<{
  info: KeyInfo
  keys: string[]
  height: number
  listRef?: React.RefObject<ListRef>
}> = ({ info, keys, height, listRef }) => {
  if (keys.length <= 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <Empty />
      </div>
    )
  }

  return (
    <List bordered={false} size="small">
      <VirtualList
        ref={listRef}
        data={keys}
        itemKey={(v) => v}
        itemHeight={39}
        height={height}
      >
        {(v) => {
          return (
            <KeyItem
              key={v}
              name={v}
              connection={info.connection}
              db={info.db}
            ></KeyItem>
          )
        }}
      </VirtualList>
    </List>
  )
}

export default VirtualKeyList
