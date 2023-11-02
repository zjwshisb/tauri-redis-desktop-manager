import React from 'react'
import { Button, Input } from 'antd'

import { EditOutlined } from '@ant-design/icons'

import Rename from '../Rename'
import { isReadonly } from '@/components/Editable'
import Context from '../../context'
import Copy from '@/components/Copy'
const Name: React.FC<{
  keys: APP.Key
  onChange: (name: string) => void
}> = ({ keys, onChange }) => {
  const connection = React.useContext(Context)

  const types = React.useMemo(() => {
    let types = keys.types
    if (keys.sub_types !== keys.types) {
      types += `(${keys.sub_types})`
    }
    return types
  }, [keys.sub_types, keys.types])

  const edit = React.useMemo(() => {
    if (isReadonly(connection)) {
      return undefined
    }
    return (
      <Rename
        trigger={
          <Button icon={<EditOutlined />} type="text" size="small"></Button>
        }
        keys={keys}
        onSuccess={onChange}
      />
    )
  }, [connection, keys, onChange])

  return (
    <Copy content={keys.name}>
      <Input
        value={keys.name}
        readOnly
        addonBefore={types}
        addonAfter={edit}
      ></Input>
    </Copy>
  )
}

export default Name
