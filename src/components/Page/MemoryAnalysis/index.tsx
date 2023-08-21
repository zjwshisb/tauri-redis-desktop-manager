import { useKeyScan, type UseKeyScanFilter } from '@/hooks/useKeyScan'
import React from 'react'
import Item from './Components/Item'
import request from '@/utils/request'
export interface KeyItem {
  name: string
  memory?: number
}
const db = 0

const MemoryAnalysis: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const [params, setParams] = React.useState<UseKeyScanFilter>({
    types: '',
    search: ''
  })

  const [items, setItems] = React.useState<KeyItem[]>([])

  const { more, getKeys } = useKeyScan(connection, db, params)

  React.useEffect(() => {
    if (more) {
      getKeys().then((res) => {
        for (const k of res) {
          request<number>('key/memory-usage', connection.id, {
            db,
            name: k
          }).then((res) => {
            setItems((pre) => {
              pre.push({
                name: k,
                memory: res.data
              })
              return [...pre]
            })
          })
        }
      })
    }
  }, [connection.id, getKeys, more])

  return (
    <div>
      222
      {items.map((v, index) => {
        return <Item key={v.name} item={v} connection={connection} db={db} />
      })}
    </div>
  )
}

export default MemoryAnalysis
