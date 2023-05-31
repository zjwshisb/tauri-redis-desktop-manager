import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Modal, message } from 'antd'
import request from '@/utils/request'
import { actionIconStyle } from '@/utils/styles'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  keys: APP.Key
  field: APP.HashField
  onSuccess: (f: APP.HashField) => void
}> = ({ field, keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <DeleteOutlined
      className="hover:cursor-pointer"
      style={actionIconStyle}
      key={'delete'}
      onClick={() => {
        Modal.confirm({
          title: t('Notice'),
          content: t('Are you sure delete <{{name}}>?', {
            name: field.name
          }),
          async onOk() {
            await request('key/hash/hdel', keys.connection_id, {
              name: keys.name,
              fields: [field.name],
              db: keys.db
            })
            message.success('Success')
            onSuccess(field)
          }
        })
      }}
    />
  )
}
export default Index
