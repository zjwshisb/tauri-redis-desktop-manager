import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { App, Button } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const HDel: React.FC<{
  keys: APP.Key
  field: APP.Field
  onSuccess: (f: APP.Field) => void
}> = ({ field, keys, onSuccess }) => {
  const { t } = useTranslation()

  const { modal, message } = App.useApp()

  return (
    <Button
      type="link"
      onClick={() => {
        modal.confirm({
          title: t('Notice'),
          content: t('Are you sure delete <{{name}}>?', {
            name: field.field
          }),
          async onOk() {
            await request('key/hash/hdel', keys.connection_id, {
              name: keys.name,
              fields: [field.field],
              db: keys.db
            })
            message.success('Success')
            onSuccess(field)
          }
        })
      }}
      icon={<DeleteOutlined />}
    ></Button>
  )
}
export default HDel
