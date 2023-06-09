import React from 'react'
import { observer } from 'mobx-react-lite'
import VirtualList, { type ListRef } from 'rc-virtual-list'
import { Typography, List, Empty } from 'antd'
import useStore from '@/hooks/useStore'
import { type DB } from '@/store/db'
import classNames from 'classnames'
import { getPageKey } from '@/utils'
import Key from '@/components/Page/Key'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  db: DB | null
  keys: string[]
  height: number
  listRef: React.RefObject<ListRef>
}> = ({ db, keys, height, listRef }) => {
  const store = useStore()

  const { t } = useTranslation()

  if (keys.length === 0 || db === null) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          height
        }}
      >
        <Empty description={t('No Keys')} />
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
          const key = getPageKey(v, db.connection, db.db)
          return (
            <List.Item
              key={key}
              onClick={(e) => {
                store.page.addPage({
                  key,
                  label: key,
                  connectionId: db.connection.id,
                  children: (
                    <Key
                      name={v}
                      db={db.db}
                      connection={db.connection}
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
          )
        }}
      </VirtualList>
    </List>
  )
}

export default observer(Index)
