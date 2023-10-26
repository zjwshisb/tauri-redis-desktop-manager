import React from 'react'
import { Input, type InputProps } from 'antd'

import { EditOutlined } from '@ant-design/icons'

import Rename from '../Rename'
import Editable from '@/components/Editable'
import Context from '../../context'
import Copy from '@/components/Copy'
const Name: React.FC<{
  keys: APP.Key
  onChange: (name: string) => void
}> = ({ keys, onChange }) => {
  const connection = React.useContext(Context)

  const props: InputProps = React.useMemo(() => {
    let types = keys.types
    if (keys.sub_types !== keys.types) {
      types += `(${keys.sub_types})`
    }
    return {
      value: keys.name,
      readOnly: true,
      addonBefore: types
    }
  }, [keys.name, keys.sub_types, keys.types])

  return (
    <Editable
      connection={connection}
      feedback={
        <Copy content={keys.name}>
          <Input {...props}></Input>
        </Copy>
      }
    >
      <Copy content={keys.name}>
        <Input
          {...props}
          addonAfter={
            <Rename
              trigger={<EditOutlined />}
              keys={keys}
              onSuccess={onChange}
            />
          }
        ></Input>
      </Copy>
    </Editable>
  )
}

export default Name
