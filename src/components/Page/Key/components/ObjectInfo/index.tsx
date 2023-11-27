import VersionAccess from '@/components/VersionAccess'
import useRequest from '@/hooks/useRequest'
import { Descriptions } from 'antd'
import React from 'react'

const Item: React.FC<{
  keys: APP.Key
  command: string
}> = ({ keys, command }) => {
  const { data: value } = useRequest<string>('key/object', keys.connection_id, {
    name: keys.name,
    value: command
  })

  return <Descriptions.Item label="Object Encoding">{value}</Descriptions.Item>
}

const ObjectInfo: React.FC<{
  keys: APP.Key
}> = ({ keys }) => {
  return (
    <Descriptions bordered size="small">
      <VersionAccess version="2.2.3">
        <Item keys={keys} command="ENCODING"></Item>
      </VersionAccess>
      <VersionAccess version="4.0.0">
        <Item keys={keys} command="FREQ"></Item>
      </VersionAccess>
      <VersionAccess version="2.2.3">
        <Item keys={keys} command="IDLETIME"></Item>
      </VersionAccess>
      <VersionAccess version="2.2.3">
        <Item keys={keys} command="REFCOUNT"></Item>
      </VersionAccess>
    </Descriptions>
  )
}

export default ObjectInfo
