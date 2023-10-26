import React from 'react'
import { Descriptions } from 'antd'

import ValueLayout from '../ValueLayout'
import useRequest from '@/hooks/useRequest'
import Add from './components/Add'
import Exists from './components/Exists'

const BloomFilterValue: React.FC<{
  keys: APP.BloomFilterKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const { data: info, fetch } = useRequest<APP.Field[]>(
    'bloom-filter/info',
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
        </>
      }
      actions={
        <>
          <Add keys={keys} onSuccess={onRefresh} />
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
export default BloomFilterValue
