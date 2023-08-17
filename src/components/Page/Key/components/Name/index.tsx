import React from 'react'
import { Input, type InputProps } from 'antd'

import { EditOutlined } from '@ant-design/icons'

import Rename from '../Rename'
import { useTranslation } from 'react-i18next'
import Editable from '@/components/Editable'
import Context from '../../context'
const Index: React.FC<{
  keys: APP.Key
  onChange: (name: string) => void
}> = ({ keys, onChange }) => {
  const { t } = useTranslation()

  const connection = React.useContext(Context)

  const addonBefore = React.useMemo(() => {
    return t(
      keys.types.slice(0, 1).toUpperCase() + keys.types.slice(1).toLowerCase()
    )
  }, [keys.types, t])

  const props: InputProps = React.useMemo(() => {
    return {
      value: keys.name,
      readOnly: true,
      addonBefore
    }
  }, [addonBefore, keys.name])

  return (
    <Editable connection={connection} feedback={<Input {...props}></Input>}>
      <Input
        {...props}
        addonAfter={
          <Rename trigger={<EditOutlined />} keys={keys} onSuccess={onChange} />
        }
      ></Input>
    </Editable>
  )
}

export default Index
