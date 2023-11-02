import { App, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Reset: React.FC<{
  keys: APP.TDigestKey
  onSuccess: () => void
}> = (props) => {
  const { t } = useTranslation()

  const { modal, message } = App.useApp()

  return (
    <Button
      type="primary"
      onClick={() => {
        modal.confirm({
          title: t('Notice'),
          content: t('Are you sure reset the key?'),
          async onOk() {
            await request<number>('tdigest/reset', props.keys.connection_id, {
              name: props.keys.name,
              db: props.keys.db
            })
            message.success(t('Success'))
            props.onSuccess()
          }
        })
      }}
    >
      RESET
    </Button>
  )
}
export default Reset
