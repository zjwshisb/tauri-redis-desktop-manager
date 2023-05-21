import React from 'react'
import { observer } from 'mobx-react-lite'
import request from '@/utils/request'
import { Button, Input, Tooltip, Typography, Affix, Empty } from 'antd'
import { useDebounceFn, useMount } from 'ahooks'
import { type DB } from '@/store/db'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { store } from '@/store'
import Key from '../Page/Key'

interface ScanResp {
  cursor: string
  keys: string[]
}

const Index: React.FC<{
  db: DB
}> = ({ db }) => {
  const [cursor, setCursor] = React.useState('0')

  const [keys, setKeys] = React.useState<string[]>([])

  const [search, setSearch] = React.useState('')

  const [more, setMore] = React.useState(true)

  const [loading, setLoading] = React.useState(false)

  const id = React.useId()

  const onSearchChange = useDebounceFn((s: string) => {
    setCursor('0')
    getKeys(s, cursor, true)
  })

  const getKeys = React.useCallback((s: string, i: string, reset: boolean = false) => {
    if (reset) {
      setLoading(true)
    }
    request<ScanResp>('key/scan', db.connection.id, {
      cursor: i,
      search: s,
      db: db.db
    }).then(res => {
      if (res.data.cursor === '0') {
        setMore(false)
      }
      setCursor(res.data.cursor)
      if (reset) {
        setKeys(res.data.keys)
      } else {
        setKeys(pre => {
          return [...pre].concat(res.data.keys)
        })
      }
    }).finally(() => {
      setLoading(false)
    })
  }, [db.connection.id, db.db])

  const reload = React.useCallback(() => {
    setCursor('0')
    getKeys(search, '0', true)
  }, [search, getKeys])

  useMount(() => {
    getKeys(search, cursor, true)
  })

  return <div className="flex flex-col px-2  overflow-hidden h-[100vh] overflow-y-auto bg-white" id={id}>
    <Affix offsetTop={0} target={() => {
      return document.getElementById(id)
    }}>
        <div className="py-2 bg-white flex item-center">
          <Input
              prefix={<SearchOutlined />}
              placeholder={'search'}
              value={search}
              allowClear
              onChange={e => {
                setSearch(e.target.value)
                onSearchChange.run(e.target.value)
              }}
         />
         <div className='w-[20px] flex-shrink-0 flex item-center pl-2 justify-center'>
           <ReloadOutlined className='hover:cursor-pointer blue-sky' onClick={reload}/>
         </div>
        </div>
    </Affix>
    {
      keys.map(v => {
        return <Tooltip key={v} mouseEnterDelay={0.5} title={v} >
            <Typography.Text className="flex-shrink-0 rounded hover:white
            hover:cursor-pointer hover:bg-sky-200" ellipsis={true} onClick={e => {
              request<APP.Key>('key/get', db.connection.id, {
                key: v
              }).then(res => {
                store.page.addPage({
                  key: res.data.name,
                  label: res.data.name,
                  children: <Key item={res.data}></Key>
                })
              })
              e.stopPropagation()
            }}>
              {v}
            </Typography.Text>
          </Tooltip>
      })
      }
      {
        more && keys.length > 0 && <div className='mb-4'><Button block onClick={() => {
          getKeys(search, cursor)
        }}>load more</Button></div>
      }
      {
        keys.length === 0 && <Empty />
      }
    </div>
}

export default observer(Index)
