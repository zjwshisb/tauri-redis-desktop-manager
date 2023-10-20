import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Modal, message } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'
import IconButton from '@/components/IconButton'

const Index: React.FC<{
  keys: APP.Key
  field: APP.Field
  onSuccess: (f: APP.Field) => void
}> = ({ field, keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <IconButton
      onClick={() => {
        Modal.confirm({
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
    ></IconButton>
  )
}
export default Index
