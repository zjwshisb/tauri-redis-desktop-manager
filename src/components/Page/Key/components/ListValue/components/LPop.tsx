import { App, Button } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const LPop: React.FC<{
  keys: APP.ListKey
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
          content: t('Are you sure pop a value from the left?'),
          async onOk() {
            await request<number>('key/list/lpop', props.keys.connection_id, {
              name: props.keys.name,
              db: props.keys.db
            })
            message.success(t('Success'))
            props.onSuccess()
          }
        })
      }}
    >
      LPOP
    </Button>
  )
}
export default LPop
