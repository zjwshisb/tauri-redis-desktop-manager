import React, { useContext } from 'react'
import { Button, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import Expire from '../Expire'
import context from '../../context'
import { isReadonly } from '@/components/Editable'

const TTL: React.FC<{
  keys: APP.Key
  onChange: () => void
}> = ({ keys, onChange }) => {
  const connection = useContext(context)

  const edit = React.useMemo(() => {
    if (isReadonly(connection)) {
      return undefined
    }
    return (
      <Expire
        keys={keys}
        onSuccess={onChange}
        trigger={
          <Button icon={<EditOutlined />} size="small" type="text"></Button>
        }
      />
    )
  }, [connection, keys, onChange])

  return (
    <Input
      value={keys.ttl}
      readOnly
      addonBefore={'TTL'}
      addonAfter={edit}
    ></Input>
  )
}
export default TTL
