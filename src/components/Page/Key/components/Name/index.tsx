import React from 'react'
import { Input, type InputProps } from 'antd'

import { EditOutlined } from '@ant-design/icons'

import Rename from '../Rename'
import Editable from '@/components/Editable'
import Context from '../../context'
import Copy from '@/components/Copy'
const Index: React.FC<{
  keys: APP.Key
  onChange: (name: string) => void
}> = ({ keys, onChange }) => {
  const connection = React.useContext(Context)

  const props: InputProps = React.useMemo(() => {
    return {
      value: keys.name,
      readOnly: true,
      addonBefore: keys.types
    }
  }, [keys.name, keys.types])

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

export default Index
