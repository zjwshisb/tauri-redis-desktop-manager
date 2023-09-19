import useRequest from '@/hooks/useRequest'
import { Card } from 'antd'
import React from 'react'

const Stats: React.FC<{
  connection: APP.Connection
}> = ({ connection }) => {
  const { data } = useRequest<string[]>('memory/doctor', connection.id)

  if (data?.length === 1) {
    return <Card className="!mb-4">{data[0]}</Card>
  }

  return (
    <div>
      {data?.map((v, index) => {
        return (
          <Card title={`Server ${index}`} key={index} className="!mb-4">
            {v}
          </Card>
        )
      })}
    </div>
  )
}

export default Stats
