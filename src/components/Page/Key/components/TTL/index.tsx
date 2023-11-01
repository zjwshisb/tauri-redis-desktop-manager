import React, { useContext } from 'react'
import { Input, type InputProps } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import Expire from '../Expire'
import context from '../../context'
import Editable from '@/components/Editable'

const TTL: React.FC<{
  keys: APP.Key
  onChange: () => void
}> = ({ keys, onChange }) => {
  const connection = useContext(context)

  const props: InputProps = React.useMemo(() => {
    return {
      value: keys.ttl,
      readOnly: true,
      addonBefore: 'TTL'
    }
  }, [keys.ttl])

  const content = React.useMemo(() => {
    return (
      <Editable connection={connection} feedback={<Input {...props}></Input>}>
        <Input
          {...props}
          addonAfter={
            <Expire
              keys={keys}
              onSuccess={onChange}
              trigger={<EditOutlined />}
            />
          }
        ></Input>
      </Editable>
    )
  }, [connection, keys, onChange, props])

  return content
}
export default TTL
