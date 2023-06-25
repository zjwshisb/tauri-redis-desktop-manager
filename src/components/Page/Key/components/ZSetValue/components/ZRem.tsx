import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Modal, message } from 'antd'
import request from '@/utils/request'
import IconButton from '@/components/IconButton'
import { useTranslation } from 'react-i18next'

const Index: React.FC<{
  keys: APP.Key
  value: string
  onSuccess: (f: string) => void
}> = ({ value, keys, onSuccess }) => {
  const { t } = useTranslation()

  return (
    <IconButton
      icon={<DeleteOutlined />}
      onClick={() => {
        Modal.confirm({
          title: t('notice'),
          content: t('Are you sure delete <{{name}}>', {
            name: value
          }),
          async onOk() {
            await request('key/zset/zrem', keys.connection_id, {
              name: keys.name,
              value,
              db: keys.db
            })
            message.success('success')
            onSuccess(value)
          }
        })
      }}
    ></IconButton>
  )
}
export default Index
