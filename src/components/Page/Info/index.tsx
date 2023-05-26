import React from 'react'
import useRequest from '@/hooks/useRequest'
import { Descriptions } from 'antd'

const Index: React.FC<{
  connection: APP.Connection
}> = (props) => {
  const { data } = useRequest<string>('server/info', props.connection.id)

  const info = React.useMemo(() => {
    if (data == null) {
      return []
    }
    return data
      ?.split('#')
      .filter((v) => v !== '')
      .map((v) => {
        const info = v.split('\r\n')
        return {
          type: info.splice(0, 1)[0],
          items: info
            .filter((v) => v !== '')
            .map((v) => {
              return v.split(':')
            })
        }
      })
  }, [data])

  React.useEffect(() => {
    console.log(info)
  }, [info])

  return (
    <div>
      {info.map((v) => {
        return (
          <Descriptions
            labelStyle={{ width: '200px' }}
            style={{ marginBottom: '20px' }}
            column={2}
            bordered
            size={'small'}
            title={v.type}
            key={v.type}
          >
            {v.items.map((v) => {
              return (
                <Descriptions.Item label={v[0]} key={v[0]}>
                  {v[1]}
                </Descriptions.Item>
              )
            })}
          </Descriptions>
        )
      })}
    </div>
  )
}
export default Index
