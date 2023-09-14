import React, { useContext } from 'react'
import { Input, type InputProps } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import Expire from '../Expire'
import context from '../../context'
import Editable from '@/components/Editable'

const TTL: React.FC<{
  keys: APP.Key
  onChange: () => void
}> = ({ keys, onChange }) => {
  const { t } = useTranslation()

  const connection = useContext(context)

  const props: InputProps = React.useMemo(() => {
    return {
      value: keys.ttl,
      readOnly: true,
      addonBefore: t('TTL')
    }
  }, [keys.ttl, t])

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
