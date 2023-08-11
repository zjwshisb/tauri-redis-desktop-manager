import React from 'react'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import request from '@/utils/request'
import CusModal from '@/components/CusModal'

const NormalEdit: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = ({ keys, onSuccess }) => {
  const [value, setValue] = React.useState(keys.data)

  React.useEffect(() => {
    setValue(keys.data)
  }, [keys.data])

  const { t } = useTranslation()

  return (
    <CusModal
      title={t('Edit')}
      onOk={async () => {
        return await request('key/set', keys.connection_id, {
          db: keys.db,
          name: keys.name,
          value
        }).then(() => {
          onSuccess()
          return true
        })
      }}
      trigger={<Button type="primary">{t('Edit')}</Button>}
    >
      <Input.TextArea
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
      ></Input.TextArea>
    </CusModal>
  )
}

const Edit: React.FC<{
  keys: APP.StringKey
  onSuccess: () => void
}> = (props) => {
  return <NormalEdit {...props}></NormalEdit>
}

export default Edit
