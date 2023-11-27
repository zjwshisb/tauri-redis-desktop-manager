import React from 'react'
import { Input, Space } from 'antd'

import { EditOutlined } from '@ant-design/icons'

import NameForm from './NameForm'
import Editable from '@/components/Editable'
import Context from '../../context'
import Copy from '@/components/Copy'
import CusButton from '@/components/CusButton'
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

  const addonAfter = React.useMemo(() => {
    return (
      <Space>
        <Copy
          isButton
          content={keys.name}
          buttonProps={{
            type: 'text'
          }}
        ></Copy>
        <Editable connection={connection}>
          <NameForm
            trigger={
              <CusButton
                icon={<EditOutlined />}
                type="text"
                size="small"
              ></CusButton>
            }
            keys={keys}
            onSuccess={onChange}
          />
        </Editable>
      </Space>
    )
  }, [connection, keys, onChange])

  return (
    <Input
      value={keys.name}
      readOnly
      addonBefore={types}
      addonAfter={addonAfter}
    ></Input>
  )
}

export default Name
