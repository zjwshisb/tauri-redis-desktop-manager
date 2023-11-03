import React from 'react'
import { observer } from 'mobx-react-lite'
import { Typography, Popover, Button } from 'antd'
import useStore from '@/hooks/useStore'
import Key from '@/components/Page/Key'
import { SearchOutlined } from '@ant-design/icons'
import context from '../context'
import Container from '@/components/Container'
import InteractiveContainer from '@/components/InteractiveContainer'

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
              <Container key={v} className="p-1 flex items-center border-b">
                <span>{str}</span>
                <Button
                  type="link"
                  icon={<SearchOutlined></SearchOutlined>}
                  onClick={() => {
                    dispatch({
                      type: 'filter',
                      value: {
                        search: str
                      }
                    })
                  }}
                ></Button>
              </Container>
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
      <InteractiveContainer
        className="h-[37px] box-border p-2 border-b-[0.5px]"
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
      >
        <Typography.Text ellipsis={true}>{name}</Typography.Text>
      </InteractiveContainer>
    </Popover>
  )
}

export default observer(KeyItem)
