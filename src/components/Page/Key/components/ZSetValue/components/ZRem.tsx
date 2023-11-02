import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { App, Button } from 'antd'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const ZRem: React.FC<{
  keys: APP.Key
  value: string
  onSuccess: (f: string) => void
}> = ({ value, keys, onSuccess }) => {
  const { t } = useTranslation()

  const { modal, message } = App.useApp()

  return (
    <Button
      type="link"
      icon={<DeleteOutlined />}
      onClick={() => {
        modal.confirm({
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
    ></Button>
  )
}
export default ZRem
