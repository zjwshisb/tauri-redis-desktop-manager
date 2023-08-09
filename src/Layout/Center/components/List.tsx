import React from 'react'
import { observer } from 'mobx-react-lite'
import VirtualList, { type ListRef } from 'rc-virtual-list'
import { Typography, List, Tooltip, Empty } from 'antd'
import useStore from '@/hooks/useStore'
import { type KeyInfo } from '@/store/key'
import classNames from 'classnames'
import { getPageKey } from '@/utils'
import Key from '@/components/Page/Key'

const Index: React.FC<{
  info: KeyInfo
  keys: string[]
  height: number
  listRef: React.RefObject<ListRef>
}> = ({ info, keys, height, listRef }) => {
  const store = useStore()

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
          const key = getPageKey(v, info.connection, info.db)
          return (
            <Tooltip title={v} mouseEnterDelay={0.3}>
              <List.Item
                key={key}
                onClick={(e) => {
                  store.page.addPage({
                    key,
                    label: key,
                    connectionId: info.connection.id,
                    children: (
                      <Key
                        name={v}
                        db={info.db}
                        connection={info.connection}
                        pageKey={key}
                      ></Key>
                    )
                  })
                  e.stopPropagation()
                }}
                className={classNames([
                  'hover:cursor-pointer border-none h-[37px]',
                  'hover:bg-gray-100 '
                ])}
              >
                <Typography.Text ellipsis={true}>{v}</Typography.Text>
              </List.Item>
            </Tooltip>
          )
        }}
      </VirtualList>
    </List>
  )
}

export default observer(Index)
