import React from 'react'
import { observer } from 'mobx-react-lite'
import { Typography, List, Popover } from 'antd'
import useStore from '@/hooks/useStore'
import classNames from 'classnames'
import Key from '@/components/Page/Key'
import { SearchOutlined } from '@ant-design/icons'
import context from '../context'

const KeyItem: React.FC<{
  name: string
  connection: APP.Connection
  db: number
}> = ({ name, connection, db }) => {
  const store = useStore()

  const [prefix, setPrefix] = React.useState<string[]>([])

  const [, dispatch] = React.useContext(context)

  return (
    <Popover
      overlayInnerStyle={{
        padding: 0
      }}
      content={
        <div>
          {prefix.map((v, index) => {
            const str = prefix.slice(0, index + 1).join(':')
            return (
              <div key={v} className="p-2 flex items-center">
                <span>{str}</span>
                <SearchOutlined
                  className="ml-2 text-blue-600"
                  onClick={() => {
                    dispatch({
                      type: 'filter',
                      value: {
                        search: str
                      }
                    })
                  }}
                ></SearchOutlined>
              </div>
            )
          })}
        </div>
      }
      mouseEnterDelay={0.4}
      placement="bottomLeft"
      onOpenChange={(e) => {
        if (e) {
          const s = name.split(':')
          setPrefix(s)
        }
      }}
    >
      <List.Item
        key={name}
        onClick={(e) => {
          store.page.addCreatePage(
            {
              connection,
              name,
              db,
              type: 'key'
            },
            ({ key }) => (
              <Key
                name={name}
                db={db}
                connection={connection}
                pageKey={key}
              ></Key>
            )
          )
          e.stopPropagation()
        }}
        className={classNames(['border-none h-[37px]', 'active-able'])}
      >
        <Typography.Text ellipsis={true}>{name}</Typography.Text>
      </List.Item>
    </Popover>
  )
}

export default observer(KeyItem)
