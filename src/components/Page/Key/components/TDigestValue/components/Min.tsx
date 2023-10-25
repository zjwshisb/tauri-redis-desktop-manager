import { Button, Modal } from 'antd'
import React from 'react'
import request from '@/utils/request'
import { useTranslation } from 'react-i18next'

const Min: React.FC<{
  keys: APP.TDigestKey
}> = (props) => {
  const { t } = useTranslation()

  return (
    <Button
      type="primary"
      onClick={() => {
        request<string>('tdigest/min', props.keys.connection_id, {
          name: props.keys.name,
          db: props.keys.db
        }).then((res) => {
          Modal.success({
            title: t('Minimum Observation Value'),
            content: res.data
          })
        })
      }}
    >
      MIN
    </Button>
  )
}
export default Min
