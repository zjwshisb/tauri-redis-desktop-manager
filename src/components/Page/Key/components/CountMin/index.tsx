import React from 'react'
import { Descriptions } from 'antd'

import ValueLayout from '../ValueLayout'
import useRequest from '@/hooks/useRequest'
import IncyBy from './components/Incrby'
import Query from './components/Query'
import Merge from './components/Merge'

const CountMin: React.FC<{
  keys: APP.CountMinKey
  onRefresh: () => void
}> = ({ keys, onRefresh }) => {
  const { data: info, fetch } = useRequest<APP.Field[]>(
    'cms/info',
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
          <Query keys={keys} />
        </>
      }
      actions={
        <>
          <IncyBy keys={keys} onSuccess={onRefresh} />
          <Merge keys={keys} onSuccess={onRefresh} />
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
export default CountMin
