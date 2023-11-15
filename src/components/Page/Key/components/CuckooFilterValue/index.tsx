import React from 'react'
import { Descriptions } from 'antd'

import ValueLayout from '../ValueLayout'
import useRequest from '@/hooks/useRequest'
import Add from './components/Add'
import AddNx from './components/AddNx'
import Exists from './components/Exists'
import Del from './components/Del'
import Insert from './components/Insert'
import InsertNx from './components/InsertNx'
import MExists from './components/MExists'
import Count from './components/Count'

const CuckooFilterKey: React.FC<{
  keys: APP.CuckooFilterKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const { data: info, fetch } = useRequest<APP.Field[]>(
    'cuckoo-filter/info',
    keys.connection_id,
    {
      name: keys.name,
      db: keys.db
    },
    false
  )

  React.useEffect(() => {
    fetch()
  }, [fetch, keys])

  return (
    <ValueLayout
      readonlyAction={
        <>
          <Exists keys={keys} />
          <MExists keys={keys} />
          <Count keys={keys} />
        </>
      }
      actions={
        <>
          <Add keys={keys} onSuccess={onRefresh} />
          <AddNx keys={keys} onSuccess={onRefresh}></AddNx>
          <Del keys={keys} onSuccess={onRefresh} />
          <Insert keys={keys} onSuccess={onRefresh} />
          <InsertNx keys={keys} onSuccess={onRefresh} />
        </>
      }
      header={
        info !== undefined && (
          <Descriptions
            column={3}
            bordered
            size="small"
            items={info.map((v) => {
              return {
                label: v.field,
                children: v.value
              }
            })}
          ></Descriptions>
        )
      }
    ></ValueLayout>
  )
}
export default CuckooFilterKey
