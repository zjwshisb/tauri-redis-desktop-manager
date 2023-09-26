import { Button, Modal, message } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const RPop: React.FC<{
  keys: APP.ListKey
  onSuccess: () => void
}> = (props) => {
  const { t } = useTranslation()

  return (
    <Button
      type="primary"
      onClick={() => {
        Modal.confirm({
          title: t('Notice'),
          content: t('Are you sure pop a value from the right?'),
          async onOk() {
            await request<number>('key/list/rpop', props.keys.connection_id, {
              name: props.keys.name,
              db: props.keys.db
            })
            message.success(t('Success'))
            props.onSuccess()
          }
        })
      }}
    >
      RPOP
    </Button>
  )
}
export default RPop
