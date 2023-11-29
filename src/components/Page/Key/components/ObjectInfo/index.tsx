import useRequest from '@/hooks/useRequest'
import { Descriptions } from 'antd'
import React from 'react'

const ObjectInfo: React.FC<{
  keys: APP.Key
}> = ({ keys }) => {
  const { data: value, fetch } = useRequest<APP.Field[]>(
    'key/object',
    keys.connection_id,
    {
      name: keys.name
    },
    false
  )

  React.useEffect(() => {
    fetch()
  }, [fetch, keys])

  return (
    <div className="mb-2">
      <Descriptions
        column={4}
        bordered
        size="small"
        items={value?.map((v) => {
          return {
            label: <span>{v.field}</span>,
            children: v.value
          }
        })}
      ></Descriptions>
    </div>
  )
}

export default ObjectInfo
